import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders,
  getOrderStats,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes privées (utilisateur connecté)
router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/stats").get(protect, admin, getOrderStats);
router.route("/:id").get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;