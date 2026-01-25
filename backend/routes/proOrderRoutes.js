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
  sendPaymentReminder,
  getProOrderStats,
  deleteProOrder,
} from "../controllers/proOrderController.js";
import { protect, admin, pro } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PRO ROUTES (Utilisateur Pro)
// ==========================================
router.post("/", protect, pro, createProOrder);
router.get("/my-orders", protect, pro, getMyProOrders);
router.get("/my-stats", protect, pro, getMyProOrderStats);
router.put("/:id/cancel", protect, pro, cancelMyProOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/", protect, admin, getAllProOrders);
router.get("/stats", protect, admin, getProOrderStats);

router.route("/:id")
  .get(protect, getProOrderById) // Pro ou Admin
  .delete(protect, admin, deleteProOrder);

router.put("/:id/status", protect, admin, updateProOrderStatus);
router.put("/:id/payment", protect, admin, recordProOrderPayment);
router.put("/:id/notes", protect, admin, addProOrderNotes);
router.put("/:id/invoice", protect, admin, generateInvoiceNumber);
router.post("/:id/payment-reminder", protect, admin, sendPaymentReminder);

export default router;