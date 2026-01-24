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

// ==========================================
// AUTH ROUTES
// ==========================================

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
      isPro: user.isPro,
      proStatus: user.proStatus,
      proInfo: user.proInfo,
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
      isPro: user.isPro,
      proStatus: user.proStatus,
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

// ==========================================
// USER PROFILE ROUTES
// ==========================================

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
    isPro: user.isPro,
    proStatus: user.proStatus,
    proInfo: user.proInfo,
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
      isPro: updatedUser.isPro,
      proStatus: updatedUser.proStatus,
      proInfo: updatedUser.proInfo,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
      newsletterSubscribedAt: updatedUser.newsletterSubscribedAt,
      newsletterUnsubscribedAt: updatedUser.newsletterUnsubscribedAt,
    });
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
});

// ==========================================
// ADMIN ROUTES - BASIC
// ==========================================

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    isPro,
    proStatus,
    isAdmin,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (isPro !== undefined) filter.isPro = isPro === "true";
  if (proStatus) filter.proStatus = proStatus;
  if (isAdmin !== undefined) filter.isAdmin = isAdmin === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("proInfo.approvedBy", "name email");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
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
    user.isAdmin = req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : user.isAdmin;
    user.newsletterSubscribed =
      req.body.newsletterSubscribed ?? user.newsletterSubscribed;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isPro: updatedUser.isPro,
      proStatus: updatedUser.proStatus,
      proInfo: updatedUser.proInfo,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
      newsletterSubscribedAt: updatedUser.newsletterSubscribedAt,
      newsletterUnsubscribedAt: updatedUser.newsletterUnsubscribedAt,
    });
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
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
      throw new Error("Impossible de supprimer un administrateur");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "Utilisateur supprimé" });
  } else {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
});

// ==========================================
// ADMIN ROUTES - PRO MANAGEMENT
// ==========================================

// @desc    Passer un utilisateur en Pro (manuellement par l'admin)
// @route   PUT /api/users/:id/set-pro
// @access  Private/Admin
const setUserAsPro = asyncHandler(async (req, res) => {
  const {
    companyName,
    legalStatus,
    ridetNumber,
    partnershipType,
    address,
    contactPhone,
    contactEmail,
    contactFirstName,
    contactLastName,
    discountRate,
    adminNotes,
  } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  if (user.isPro) {
    res.status(400);
    throw new Error("Cet utilisateur est déjà un compte Pro");
  }

  await user.setAsPro(
    {
      companyName,
      legalStatus,
      ridetNumber,
      partnershipType,
      address,
      contactPhone,
      contactEmail,
      contactFirstName,
      contactLastName,
      discountRate,
      adminNotes,
    },
    req.user._id
  );

  res.json({
    message: "Utilisateur passé en compte Pro avec succès",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      proStatus: user.proStatus,
      proInfo: user.proInfo,
    },
  });
});

// @desc    Mettre à jour les informations Pro d'un utilisateur
// @route   PUT /api/users/:id/pro-info
// @access  Private/Admin
const updateUserProInfo = asyncHandler(async (req, res) => {
  const {
    companyName,
    legalStatus,
    ridetNumber,
    partnershipType,
    address,
    contactPhone,
    contactEmail,
    contactFirstName,
    contactLastName,
    discountRate,
    adminNotes,
  } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  if (!user.isPro) {
    res.status(400);
    throw new Error("Cet utilisateur n'est pas un compte Pro");
  }

  // Mettre à jour les infos Pro
  if (companyName !== undefined) user.proInfo.companyName = companyName;
  if (legalStatus !== undefined) user.proInfo.legalStatus = legalStatus;
  if (ridetNumber !== undefined) user.proInfo.ridetNumber = ridetNumber;
  if (partnershipType !== undefined) user.proInfo.partnershipType = partnershipType;
  if (address !== undefined) {
    user.proInfo.address = {
      ...user.proInfo.address,
      ...address,
    };
  }
  if (contactPhone !== undefined) user.proInfo.contactPhone = contactPhone;
  if (contactEmail !== undefined) user.proInfo.contactEmail = contactEmail;
  if (contactFirstName !== undefined) user.proInfo.contactFirstName = contactFirstName;
  if (contactLastName !== undefined) user.proInfo.contactLastName = contactLastName;
  if (discountRate !== undefined) user.proInfo.discountRate = discountRate;
  if (adminNotes !== undefined) user.proInfo.adminNotes = adminNotes;

  await user.save();

  res.json({
    message: "Informations Pro mises à jour",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      proStatus: user.proStatus,
      proInfo: user.proInfo,
    },
  });
});

// @desc    Retirer le statut Pro d'un utilisateur
// @route   PUT /api/users/:id/remove-pro
// @access  Private/Admin
const removeUserPro = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  if (!user.isPro && user.proStatus !== "suspended") {
    res.status(400);
    throw new Error("Cet utilisateur n'est pas un compte Pro");
  }

  await user.removePro();

  res.json({
    message: "Statut Pro retiré",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      proStatus: user.proStatus,
    },
  });
});

// @desc    Suspendre un compte Pro
// @route   PUT /api/users/:id/suspend-pro
// @access  Private/Admin
const suspendUserPro = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  if (!user.isPro) {
    res.status(400);
    throw new Error("Cet utilisateur n'est pas un compte Pro");
  }

  await user.suspendPro();

  res.json({
    message: "Compte Pro suspendu",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      proStatus: user.proStatus,
    },
  });
});

// @desc    Réactiver un compte Pro suspendu
// @route   PUT /api/users/:id/reactivate-pro
// @access  Private/Admin
const reactivateUserPro = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  if (user.proStatus !== "suspended") {
    res.status(400);
    throw new Error("Ce compte Pro n'est pas suspendu");
  }

  await user.reactivatePro();

  res.json({
    message: "Compte Pro réactivé",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isPro: user.isPro,
      proStatus: user.proStatus,
    },
  });
});

// @desc    Obtenir les statistiques des utilisateurs Pro
// @route   GET /api/users/pro-stats
// @access  Private/Admin
const getUserProStats = asyncHandler(async (req, res) => {
  const stats = await User.getProStats();
  res.json(stats);
});

// @desc    Obtenir tous les utilisateurs Pro
// @route   GET /api/users/pro
// @access  Private/Admin
const getProUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    partnershipType,
    proStatus,
    sortBy = "proInfo.approvedAt",
    sortOrder = "desc",
  } = req.query;

  const filter = { isPro: true };
  if (partnershipType) filter["proInfo.partnershipType"] = partnershipType;
  if (proStatus) filter.proStatus = proStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("proInfo.approvedBy", "name email"),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// export {
//   authUser,
//   registerUser,
//   logoutUser,
//   getUserProfile,
//   updateUserProfile,
//   getUsers,
//   getUserById,
//   deleteUser,
//   updateUser,
//   // Pro management
//   setUserAsPro,
//   updateUserProInfo,
//   removeUserPro,
//   suspendUserPro,
//   reactivateUserPro,
//   getUserProStats,
//   getProUsers,
// };

// @desc    Obtenir les statistiques générales des utilisateurs
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalAdmins,
    totalPro,
    proPending,
    proApproved,
    proSuspended,
    newsletterSubscribed,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isAdmin: true }),
    User.countDocuments({ isPro: true }),
    User.countDocuments({ proStatus: "pending" }),
    User.countDocuments({ proStatus: "approved" }),
    User.countDocuments({ proStatus: "suspended" }),
    User.countDocuments({ newsletterSubscribed: true }),
  ]);

  // Inscriptions des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Par type de partenariat Pro
  const byPartnershipType = await User.aggregate([
    { $match: { isPro: true } },
    { $group: { _id: "$proInfo.partnershipType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    totalUsers,
    totalAdmins,
    totalPro,
    proPending,
    proApproved,
    proSuspended,
    newsletterSubscribed,
    recentUsers,
    byPartnershipType,
  });
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
  // Pro management
  setUserAsPro,
  updateUserProInfo,
  removeUserPro,
  suspendUserPro,
  reactivateUserPro,
  getUserProStats,
  getProUsers,
  getUserStats, // NOUVEAU
};