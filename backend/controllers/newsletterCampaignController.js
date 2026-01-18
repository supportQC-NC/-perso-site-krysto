import asyncHandler from "../middleware/asyncHandler.js";
import NewsletterCampaign from "../models/newsletterCampaignModel.js";
import Prospect from "../models/prospectModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { getCampaignTemplate, campaignTypeLabels } from "../utils/campaignTemplates.js";

// ==========================================
// CRUD CAMPAGNES
// ==========================================

// @desc    Créer une nouvelle campagne
// @route   POST /api/newsletters
// @access  Private/Admin
const createCampaign = asyncHandler(async (req, res) => {
  const { name, subject, type, content, recipients, scheduledAt } = req.body;

  const campaign = await NewsletterCampaign.create({
    name,
    subject,
    type: type || "newsletter",
    content,
    recipients: recipients || "all",
    scheduledAt: scheduledAt || null,
    createdBy: req.user._id,
  });

  res.status(201).json(campaign);
});

// @desc    Récupérer toutes les campagnes
// @route   GET /api/newsletters
// @access  Private/Admin
const getCampaigns = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [campaigns, total] = await Promise.all([
    NewsletterCampaign.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email"),
    NewsletterCampaign.countDocuments(filter),
  ]);

  res.status(200).json({
    campaigns,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer une campagne par ID
// @route   GET /api/newsletters/:id
// @access  Private/Admin
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id).populate(
    "createdBy",
    "name email"
  );

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  res.status(200).json(campaign);
});

// @desc    Mettre à jour une campagne
// @route   PUT /api/newsletters/:id
// @access  Private/Admin
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  // Ne pas modifier une campagne déjà envoyée
  if (campaign.status === "sent" || campaign.status === "sending") {
    res.status(400);
    throw new Error("Impossible de modifier une campagne déjà envoyée");
  }

  const { name, subject, type, content, recipients, scheduledAt, status } = req.body;

  if (name) campaign.name = name;
  if (subject) campaign.subject = subject;
  if (type) campaign.type = type;
  if (content) campaign.content = { ...campaign.content, ...content };
  if (recipients) campaign.recipients = recipients;
  if (scheduledAt !== undefined) campaign.scheduledAt = scheduledAt;
  if (status && status !== "sent" && status !== "sending") campaign.status = status;

  const updatedCampaign = await campaign.save();

  res.status(200).json(updatedCampaign);
});

// @desc    Supprimer une campagne
// @route   DELETE /api/newsletters/:id
// @access  Private/Admin
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  await campaign.deleteOne();

  res.status(200).json({ message: "Campagne supprimée avec succès" });
});

// @desc    Dupliquer une campagne
// @route   POST /api/newsletters/:id/duplicate
// @access  Private/Admin
const duplicateCampaign = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  const duplicated = await NewsletterCampaign.create({
    name: `${campaign.name} (copie)`,
    subject: campaign.subject,
    type: campaign.type,
    content: campaign.content,
    recipients: campaign.recipients,
    status: "draft",
    createdBy: req.user._id,
  });

  res.status(201).json(duplicated);
});

// ==========================================
// ENVOI DE CAMPAGNE
// ==========================================

// @desc    Envoyer une campagne
// @route   POST /api/newsletters/:id/send
// @access  Private/Admin
const sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  if (campaign.status === "sent") {
    res.status(400);
    throw new Error("Cette campagne a déjà été envoyée");
  }

  if (campaign.status === "sending") {
    res.status(400);
    throw new Error("Cette campagne est en cours d'envoi");
  }

  // Récupérer les destinataires
  let emails = [];

  switch (campaign.recipients) {
    case "prospects":
      // Uniquement les prospects actifs
      const prospects = await Prospect.find({ status: "active" }).select("email");
      emails = prospects.map((p) => p.email);
      break;

    case "users":
      // Uniquement les utilisateurs
      const users = await User.find({}).select("email");
      emails = users.map((u) => u.email);
      break;

    case "newsletter_users":
      // Utilisateurs inscrits à la newsletter
      const newsletterUsers = await User.find({ newsletterSubscribed: true }).select("email");
      emails = newsletterUsers.map((u) => u.email);
      break;

    case "all":
    default:
      // Tous : prospects actifs + utilisateurs inscrits newsletter
      const allProspects = await Prospect.find({ status: "active" }).select("email");
      const allNewsletterUsers = await User.find({ newsletterSubscribed: true }).select("email");
      
      const prospectEmails = allProspects.map((p) => p.email);
      const userEmails = allNewsletterUsers.map((u) => u.email);
      
      // Dédoublonner
      emails = [...new Set([...prospectEmails, ...userEmails])];
      break;
  }

  if (emails.length === 0) {
    res.status(400);
    throw new Error("Aucun destinataire trouvé pour cette campagne");
  }

  // Mettre à jour le statut
  campaign.status = "sending";
  campaign.stats.totalRecipients = emails.length;
  await campaign.save();

  // Envoyer les emails en arrière-plan
  let sent = 0;
  let failed = 0;
  const failedEmails = [];

  // Envoyer les emails par lots de 10 pour éviter de surcharger le serveur SMTP
  const batchSize = 10;
  const batches = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    batches.push(emails.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (email) => {
        try {
          const html = getCampaignTemplate(campaign, email);
          
          await sendEmail({
            email,
            subject: campaign.subject,
            html,
          });
          
          sent++;
        } catch (error) {
          failed++;
          failedEmails.push({
            email,
            error: error.message,
          });
          console.error(`Erreur envoi email à ${email}:`, error.message);
        }
      })
    );
    
    // Petite pause entre les lots
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Mettre à jour les stats
  campaign.status = "sent";
  campaign.sentAt = new Date();
  campaign.stats.sent = sent;
  campaign.stats.failed = failed;
  campaign.failedEmails = failedEmails;
  await campaign.save();

  res.status(200).json({
    message: `Campagne envoyée avec succès`,
    stats: {
      total: emails.length,
      sent,
      failed,
    },
  });
});

// @desc    Envoyer un email de test
// @route   POST /api/newsletters/:id/test
// @access  Private/Admin
const sendTestEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    res.status(400);
    throw new Error("Email de test requis");
  }

  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  try {
    const html = getCampaignTemplate(campaign, email);
    
    await sendEmail({
      email,
      subject: `[TEST] ${campaign.subject}`,
      html,
    });

    res.status(200).json({
      message: `Email de test envoyé à ${email}`,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Erreur lors de l'envoi: ${error.message}`);
  }
});

// @desc    Prévisualiser une campagne (retourne le HTML)
// @route   GET /api/newsletters/:id/preview
// @access  Private/Admin
const previewCampaign = asyncHandler(async (req, res) => {
  const campaign = await NewsletterCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  const html = getCampaignTemplate(campaign, "preview@example.com");

  res.status(200).json({
    html,
    subject: campaign.subject,
  });
});

// ==========================================
// STATISTIQUES
// ==========================================

// @desc    Obtenir les statistiques globales
// @route   GET /api/newsletters/stats
// @access  Private/Admin
const getCampaignStats = asyncHandler(async (req, res) => {
  const stats = await NewsletterCampaign.getStats();

  // Compter les destinataires potentiels
  const activeProspects = await Prospect.countDocuments({ status: "active" });
  const newsletterUsers = await User.countDocuments({ newsletterSubscribed: true });

  res.status(200).json({
    ...stats,
    potentialRecipients: {
      prospects: activeProspects,
      users: newsletterUsers,
      total: activeProspects + newsletterUsers,
    },
  });
});

// @desc    Obtenir les types de campagnes disponibles
// @route   GET /api/newsletters/types
// @access  Private/Admin
const getCampaignTypes = asyncHandler(async (req, res) => {
  res.status(200).json(campaignTypeLabels);
});

// @desc    Compter les destinataires selon le filtre
// @route   GET /api/newsletters/recipients/count
// @access  Private/Admin
const countRecipients = asyncHandler(async (req, res) => {
  const { filter = "all" } = req.query;

  let count = 0;

  switch (filter) {
    case "prospects":
      count = await Prospect.countDocuments({ status: "active" });
      break;
    case "users":
      count = await User.countDocuments({});
      break;
    case "newsletter_users":
      count = await User.countDocuments({ newsletterSubscribed: true });
      break;
    case "all":
    default:
      const prospects = await Prospect.countDocuments({ status: "active" });
      const users = await User.countDocuments({ newsletterSubscribed: true });
      // Note: peut contenir des doublons
      count = prospects + users;
      break;
  }

  res.status(200).json({ count, filter });
});

export {
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
};
