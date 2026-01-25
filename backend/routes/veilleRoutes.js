import express from "express";
import {
  createVeille,
  getVeilles,
  getVeilleById,
  updateVeille,
  deleteVeille,
  deleteMultipleVeilles,
  markAsRead,
  toggleFavorite,
  archiveVeille,
  unarchiveVeille,
  moveToCategory,
  bulkUpdateTags,
  getVeilleStats,
  getAllTags,
  getRecentVeilles,
  getFavoriteVeilles,
  getVeillesByCategory,
} from "../controllers/veilleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées (admin uniquement)
router.use(protect, admin);

// Routes principales
router.route("/")
  .post(createVeille)
  .get(getVeilles);

// Routes spéciales (avant les routes avec :id pour éviter les conflits)
router.route("/stats").get(getVeilleStats);
router.route("/tags").get(getAllTags);
router.route("/recent").get(getRecentVeilles);
router.route("/favorites").get(getFavoriteVeilles);
router.route("/bulk").delete(deleteMultipleVeilles);
router.route("/move-category").put(moveToCategory);
router.route("/bulk-tags").put(bulkUpdateTags);

// Routes par catégorie
router.route("/category/:categoryId").get(getVeillesByCategory);

// Routes avec paramètre ID
router.route("/:id")
  .get(getVeilleById)
  .put(updateVeille)
  .delete(deleteVeille);

// Actions rapides sur une veille
router.route("/:id/read").put(markAsRead);
router.route("/:id/favorite").put(toggleFavorite);
router.route("/:id/archive").put(archiveVeille);
router.route("/:id/unarchive").put(unarchiveVeille);

export default router;