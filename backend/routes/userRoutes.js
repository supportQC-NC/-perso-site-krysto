import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  setUserAsPro,
  updateUserProInfo,
  removeUserPro,
  suspendUserPro,
  reactivateUserPro,
  getUserProStats,
  getProUsers,
  getUserStats,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post("/login", authUser);
router.post("/", registerUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// ==========================================
// PROTECTED ROUTES (User)
// ==========================================
router.post("/logout", protect, logoutUser);
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/", protect, admin, getUsers);
router.get("/stats", protect, admin, getUserStats);
router.get("/pro-stats", protect, admin, getUserProStats);
router.get("/pro", protect, admin, getProUsers);

router.route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Pro management routes
router.put("/:id/set-pro", protect, admin, setUserAsPro);
router.put("/:id/pro-info", protect, admin, updateUserProInfo);
router.put("/:id/remove-pro", protect, admin, removeUserPro);
router.put("/:id/suspend-pro", protect, admin, suspendUserPro);
router.put("/:id/reactivate-pro", protect, admin, reactivateUserPro);

export default router;