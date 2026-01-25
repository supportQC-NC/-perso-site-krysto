import express from "express";
import {
  createVeilleCategory,
  getVeilleCategories,
  getVeilleCategoryById,
  updateVeilleCategory,
  deleteVeilleCategory,
  reorderVeilleCategories,
} from "../controllers/veilleCategoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées (admin uniquement)
router.use(protect, admin);

// Routes CRUD de base
router.route("/")
  .post(createVeilleCategory)
  .get(getVeilleCategories);

// Route pour réorganiser les catégories
router.route("/reorder").put(reorderVeilleCategories);

// Routes avec paramètre ID
router.route("/:id")
  .get(getVeilleCategoryById)
  .put(updateVeilleCategory)
  .delete(deleteVeilleCategory);

export default router;