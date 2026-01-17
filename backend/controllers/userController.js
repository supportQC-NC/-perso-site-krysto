import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import { welcomeEmailTemplate } from "../utils/emailTemplates.js";
import generateToken from "../utils/generateToken.js";

// Helper: Get user from JWT cookie
const getUserFromToken = async (req) => {
  const token = req.cookies?.token;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId).select("-password");
  } catch (error) {
    return null;
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      newsletterSubscribed: user.newsletterSubscribed,
      newsletterSubscribedAt: user.newsletterSubscribedAt,
      newsletterUnsubscribedAt: user.newsletterUnsubscribedAt,
    });
  } else {
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, newsletterSubscribed } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Cet utilisateur existe déjà");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    newsletterSubscribed,
  });

  if (user) {
    generateToken(res, user._id);

    // Envoyer l'email de bienvenue
    try {
      await sendEmail({
        email: user.email,
        subject: "Bienvenue sur Krysto ! 🌿",
        html: welcomeEmailTemplate(user.name),
      });
    } catch (error) {
      console.log("Erreur envoi email de bienvenue:", error);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      newsletterSubscribed: user.newsletterSubscribed,
      newsletterSubscribedAt: user.newsletterSubscribedAt,
      newsletterUnsubscribedAt: user.newsletterUnsubscribedAt,
    });
  } else {
    res.status(400);
    throw new Error("Données utilisateur invalides");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Déconnexion réussie" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getUserFromToken(req);

  if (!user) {
    res.status(401);
    throw new Error("Non autorisé, veuillez vous connecter");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    newsletterSubscribed: user.newsletterSubscribed,
    newsletterSubscribedAt: user.newsletterSubscribedAt,
    newsletterUnsubscribedAt: user.newsletterUnsubscribedAt,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const tokenUser = await getUserFromToken(req);

  if (!tokenUser) {
    res.status(401);
    throw new Error("Non autorisé, veuillez vous connecter");
  }

  const user = await User.findById(tokenUser._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.newsletterSubscribed =
      req.body.newsletterSubscribed ?? user.newsletterSubscribed;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
      newsletterSubscribedAt: updatedUser.newsletterSubscribedAt,
      newsletterUnsubscribedAt: updatedUser.newsletterUnsubscribedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    user.newsletterSubscribed =
      req.body.newsletterSubscribed ?? user.newsletterSubscribed;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
      newsletterSubscribedAt: updatedUser.newsletterSubscribedAt,
      newsletterUnsubscribedAt: updatedUser.newsletterUnsubscribedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};