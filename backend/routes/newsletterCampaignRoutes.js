import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  sendCampaign,
  sendTestEmail,
  previewCampaign,
  getCampaignStats,
  getCampaignTypes,
  countRecipients,
} from "../controllers/newsletterCampaignController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées et réservées aux admins
router.use(protect, admin);

// Routes de base
router.route("/").get(getCampaigns).post(createCampaign);

// Routes utilitaires (doivent être avant /:id)
router.get("/stats", getCampaignStats);
router.get("/types", getCampaignTypes);
router.get("/recipients/count", countRecipients);

// Routes avec ID
router
  .route("/:id")
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

// Actions sur une campagne
router.post("/:id/send", sendCampaign);
router.post("/:id/test", sendTestEmail);
router.get("/:id/preview", previewCampaign);
router.post("/:id/duplicate", duplicateCampaign);

export default router;
