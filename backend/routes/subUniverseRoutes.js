import express from "express";
import {
  getSubUniverses,
  getActiveSubUniverses,
  getSubUniversesByUniverse,
  getSubUniverseById,
  getSubUniverseBySlug,
  getSubUniverseProducts,
  createSubUniverse,
  updateSubUniverse,
  deleteSubUniverse,
  reorderSubUniverses,
  getSubUniverseStats,
} from "../controllers/subUniverseController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.route("/").get(getSubUniverses).post(protect, admin, createSubUniverse);
router.get("/active", getActiveSubUniverses);
router.get("/slug/:slug", getSubUniverseBySlug);
router.get("/by-universe/:universeId", getSubUniversesByUniverse);

// Routes admin
router.get("/stats", protect, admin, getSubUniverseStats);
router.put("/reorder", protect, admin, reorderSubUniverses);

// Routes avec ID
router
  .route("/:id")
  .get(getSubUniverseById)
  .put(protect, admin, updateSubUniverse)
  .delete(protect, admin, deleteSubUniverse);

// Produits d'un sous-univers
router.get("/:id/products", getSubUniverseProducts);

export default router;
