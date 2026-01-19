import express from "express";
import {
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
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post("/", registerUser);
router.post("/login", authUser);

// ==========================================
// USER ROUTES (authentifié)
// ==========================================
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Stats Pro (doit être avant /:id)
router.get("/pro-stats", protect, admin, getUserProStats);

// Liste des utilisateurs Pro
router.get("/pro", protect, admin, getProUsers);

// Liste de tous les utilisateurs
router.get("/", protect, admin, getUsers);

// Routes avec ID
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Gestion Pro
router.put("/:id/set-pro", protect, admin, setUserAsPro);
router.put("/:id/pro-info", protect, admin, updateUserProInfo);
router.put("/:id/remove-pro", protect, admin, removeUserPro);
router.put("/:id/suspend-pro", protect, admin, suspendUserPro);
router.put("/:id/reactivate-pro", protect, admin, reactivateUserPro);

export default router;