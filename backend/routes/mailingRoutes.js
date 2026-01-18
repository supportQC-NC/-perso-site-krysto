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
  getMailingStats,
  getTemplateTypes,
  getRecipientTypes,
  countRecipients,
  cancelCampaign,
} from "../controllers/mailingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes sont protégées et réservées aux admins
router.use(protect, admin);

// Routes utilitaires (doivent être avant /:id)
router.get("/stats", getMailingStats);
router.get("/templates", getTemplateTypes);
router.get("/recipient-types", getRecipientTypes);
router.post("/count-recipients", countRecipients);

// Routes de base
router.route("/").get(getCampaigns).post(createCampaign);

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
router.put("/:id/cancel", cancelCampaign);

export default router;