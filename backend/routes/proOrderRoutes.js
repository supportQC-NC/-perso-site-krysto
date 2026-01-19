import express from "express";
import {
  // Pro routes
  createProOrder,
  getMyProOrders,
  getProOrderById,
  cancelMyProOrder,
  getMyProOrderStats,
  // Admin routes
  getAllProOrders,
  updateProOrderStatus,
  recordProOrderPayment,
  addProOrderNotes,
  generateInvoiceNumber,
  getProOrderStats,
  deleteProOrder,
} from "../controllers/proOrderController.js";
import { protect, admin, pro } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTES PRO (utilisateur Pro connecté)
// ==========================================

// Créer une commande Pro
router.post("/", protect, pro, createProOrder);

// Mes commandes
router.get("/my-orders", protect, pro, getMyProOrders);

// Mes stats
router.get("/my-stats", protect, pro, getMyProOrderStats);

// Annuler ma commande
router.put("/:id/cancel", protect, pro, cancelMyProOrder);

// ==========================================
// ROUTES ADMIN
// ==========================================

// Stats globales (doit être avant /:id)
router.get("/stats", protect, admin, getProOrderStats);

// Liste de toutes les commandes Pro
router.get("/", protect, admin, getAllProOrders);

// Actions sur une commande
router.put("/:id/status", protect, admin, updateProOrderStatus);
router.put("/:id/payment", protect, admin, recordProOrderPayment);
router.put("/:id/notes", protect, admin, addProOrderNotes);
router.put("/:id/invoice", protect, admin, generateInvoiceNumber);

// Suppression
router.delete("/:id", protect, admin, deleteProOrder);

// ==========================================
// ROUTE COMMUNE (Pro ou Admin)
// ==========================================

// Détail d'une commande (vérifie l'accès dans le contrôleur)
router.get("/:id", protect, getProOrderById);

export default router;