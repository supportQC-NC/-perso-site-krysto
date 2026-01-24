import express from "express";
import {
  // CRUD
  createTemplate,
  getTemplates,
  getDefaultTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  // Blocs
  getBlockTypes,
  getTemplateCategories,
  createBlock,
  // Preview
  previewTemplate,
  previewBlocks,
  previewSingleBlock,
  // Utils
  seedDefaultTemplates,
  getTemplateStats,
} from "../controllers/maillingTemplateController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ROUTES STATIQUES (avant les routes avec :id)
// ==========================================

// GET /api/mailing-templates/defaults - Templates par défaut
router.route("/defaults").get(protect, admin, getDefaultTemplates);

// GET /api/mailing-templates/block-types - Types de blocs disponibles
router.route("/block-types").get(protect, admin, getBlockTypes);

// GET /api/mailing-templates/categories - Catégories de templates
router.route("/categories").get(protect, admin, getTemplateCategories);

// POST /api/mailing-templates/create-block - Créer un bloc vide
router.route("/create-block").post(protect, admin, createBlock);

// POST /api/mailing-templates/preview-blocks - Prévisualiser des blocs
router.route("/preview-blocks").post(protect, admin, previewBlocks);

// POST /api/mailing-templates/preview-block - Prévisualiser un seul bloc
router.route("/preview-block").post(protect, admin, previewSingleBlock);

// POST /api/mailing-templates/seed-defaults - Initialiser les templates par défaut
router.route("/seed-defaults").post(protect, admin, seedDefaultTemplates);

// GET /api/mailing-templates/stats - Statistiques des templates
router.route("/stats").get(protect, admin, getTemplateStats);

// ==========================================
// ROUTES CRUD PRINCIPALES
// ==========================================

// GET /api/mailing-templates - Liste des templates
// POST /api/mailing-templates - Créer un template
router.route("/").get(protect, admin, getTemplates).post(protect, admin, createTemplate);

// ==========================================
// ROUTES AVEC :id
// ==========================================

// GET /api/mailing-templates/:id - Récupérer un template
// PUT /api/mailing-templates/:id - Mettre à jour un template
// DELETE /api/mailing-templates/:id - Supprimer un template
router
  .route("/:id")
  .get(protect, admin, getTemplateById)
  .put(protect, admin, updateTemplate)
  .delete(protect, admin, deleteTemplate);

// POST /api/mailing-templates/:id/duplicate - Dupliquer un template
router.route("/:id/duplicate").post(protect, admin, duplicateTemplate);

// POST /api/mailing-templates/:id/preview - Prévisualiser un template
router.route("/:id/preview").post(protect, admin, previewTemplate);

export default router;