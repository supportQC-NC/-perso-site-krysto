import express from "express";
import {
  // User routes
  createProRequest,
  getMyProRequests,
  cancelMyProRequest,
  // Admin routes
  getProRequests,
  getProRequestById,
  approveProRequest,
  rejectProRequest,
  addAdminNotes,
  deleteProRequest,
  getProRequestStats,
} from "../controllers/proRequestController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTES UTILISATEUR (authentifié)
// ==========================================

// Créer une demande Pro
router.post("/", protect, createProRequest);

// Obtenir mes demandes
router.get("/my-requests", protect, getMyProRequests);

// Annuler ma demande
router.put("/:id/cancel", protect, cancelMyProRequest);

// ==========================================
// ROUTES ADMIN
// ==========================================

// Stats (doit être avant /:id)
router.get("/stats", protect, admin, getProRequestStats);

// Liste des demandes
router.get("/", protect, admin, getProRequests);

// Demande par ID
router
  .route("/:id")
  .get(protect, admin, getProRequestById)
  .delete(protect, admin, deleteProRequest);

// Actions admin
router.put("/:id/approve", protect, admin, approveProRequest);
router.put("/:id/reject", protect, admin, rejectProRequest);
router.put("/:id/notes", protect, admin, addAdminNotes);

export default router;