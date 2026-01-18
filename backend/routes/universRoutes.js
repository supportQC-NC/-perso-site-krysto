import express from "express";
import {
  getUniverses,
  getActiveUniverses,
  getUniverseById,
  getUniverseBySlug,
  getUniverseProducts,
  createUniverse,
  updateUniverse,
  deleteUniverse,
  reorderUniverses,
  getUniverseStats,
} from "../controllers/universeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.route("/").get(getUniverses).post(protect, admin, createUniverse);
router.get("/active", getActiveUniverses);
router.get("/slug/:slug", getUniverseBySlug);

// Routes admin
router.get("/stats", protect, admin, getUniverseStats);
router.put("/reorder", protect, admin, reorderUniverses);

// Routes avec ID
router
  .route("/:id")
  .get(getUniverseById)
  .put(protect, admin, updateUniverse)
  .delete(protect, admin, deleteUniverse);

// Produits d'un univers
router.get("/:id/products", getUniverseProducts);

export default router;
