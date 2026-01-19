import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect routes - Vérifie que l'utilisateur est connecté
const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Token non valide");
    }
  } else {
    res.status(401);
    throw new Error("Non autorisé, pas de token");
  }
});

// Admin middleware - Vérifie que l'utilisateur est admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Non autorisé - Accès réservé aux administrateurs");
  }
};

// Pro middleware - Vérifie que l'utilisateur est un compte Pro actif
const pro = (req, res, next) => {
  if (req.user && req.user.isPro && req.user.proStatus === "approved") {
    next();
  } else if (req.user && req.user.isAdmin) {
    // Les admins peuvent aussi accéder aux routes Pro
    next();
  } else {
    res.status(403);
    throw new Error("Non autorisé - Accès réservé aux comptes professionnels");
  }
};

// Pro or Admin middleware - Vérifie que l'utilisateur est Pro OU Admin
const proOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || (req.user.isPro && req.user.proStatus === "approved"))) {
    next();
  } else {
    res.status(403);
    throw new Error("Non autorisé - Accès réservé aux professionnels ou administrateurs");
  }
};

export { protect, admin, pro, proOrAdmin };