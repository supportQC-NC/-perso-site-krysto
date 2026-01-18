import express from "express";
import {
  // Public
  subscribeNewsletter,
  unsubscribeNewsletter,
  checkSubscriptionStatus,
  // Admin
  getProspects,
  getProspectById,
  updateProspect,
  deleteProspect,
  bulkDeleteProspects,
  getProspectStats,
  markProspectAsConverted,
  bulkAddTagsToProspects,
  exportProspects,
} from "../controllers/prospectController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTES PUBLIQUES
// ==========================================

// Inscription à la newsletter
router.post("/", subscribeNewsletter);

// Désabonnement
router.put("/unsubscribe", unsubscribeNewsletter);

// Vérifier le statut d'inscription
router.get("/check/:email", checkSubscriptionStatus);

// ==========================================
// ROUTES ADMIN (protégées)
// ==========================================

// Stats (doit être avant /:id)
router.get("/stats", protect, admin, getProspectStats);

// Export
router.get("/export", protect, admin, exportProspects);

// Suppression en masse
router.delete("/bulk", protect, admin, bulkDeleteProspects);

// Ajout de tags en masse
router.put("/bulk/tags", protect, admin, bulkAddTagsToProspects);

// Liste des prospects
router.get("/", protect, admin, getProspects);

// Routes avec ID
router
  .route("/:id")
  .get(protect, admin, getProspectById)
  .put(protect, admin, updateProspect)
  .delete(protect, admin, deleteProspect);

// Marquer comme converti
router.put("/:id/convert", protect, admin, markProspectAsConverted);

export default router;
