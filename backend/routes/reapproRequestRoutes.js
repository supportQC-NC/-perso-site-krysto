import express from "express";
import {
  // Pro routes
  createReapproRequest,
  getMyReapproRequests,
  getReapproRequestById,
  cancelMyReapproRequest,
  getMyReapproStats,
  // Admin routes
  getAllReapproRequests,
  approveReapproRequest,
  rejectReapproRequest,
  convertToProOrder,
  updateReapproStatus,
  addReapproNotes,
  getReapproStats,
  deleteReapproRequest,
} from "../controllers/reapproRequestController.js";
import { protect, admin, pro } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTES PRO (utilisateur Pro connecté)
// ==========================================

// Créer une demande
router.post("/", protect, pro, createReapproRequest);

// Mes demandes
router.get("/my-requests", protect, pro, getMyReapproRequests);

// Mes stats
router.get("/my-stats", protect, pro, getMyReapproStats);

// Annuler ma demande
router.put("/:id/cancel", protect, pro, cancelMyReapproRequest);

// ==========================================
// ROUTES ADMIN
// ==========================================

// Stats globales (doit être avant /:id)
router.get("/stats", protect, admin, getReapproStats);

// Liste de toutes les demandes
router.get("/", protect, admin, getAllReapproRequests);

// Actions sur une demande
router.put("/:id/approve", protect, admin, approveReapproRequest);
router.put("/:id/reject", protect, admin, rejectReapproRequest);
router.post("/:id/convert-to-order", protect, admin, convertToProOrder);
router.put("/:id/status", protect, admin, updateReapproStatus);
router.put("/:id/notes", protect, admin, addReapproNotes);

// Suppression
router.delete("/:id", protect, admin, deleteReapproRequest);

// ==========================================
// ROUTE COMMUNE (Pro ou Admin)
// ==========================================

// Détail d'une demande (vérifie l'accès dans le contrôleur)
router.get("/:id", protect, getReapproRequestById);

export default router;