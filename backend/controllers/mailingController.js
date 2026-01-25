import asyncHandler from "../middleware/asyncHandler.js";
import MailingCampaign from "../models/mailingCampaignModel.js";
import Prospect from "../models/prospectModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import {
  generateMailingTemplate,
  templateLabels,
  recipientLabels,
} from "../utils/mailingTemplates.js";
// NOUVEAU: Import du renderer de blocs
import { renderEmailFromBlocks } from "../utils/blockMailRenderer.js";

// ==========================================
// HELPER: Générer le HTML de l'email
// Supporte les deux systèmes (blocs et templates)
// ==========================================
const generateEmailHtml = (campaign, recipientEmail) => {
  // Si la campagne utilise le système de blocs
  if (campaign.blocks && campaign.blocks.length > 0) {
    console.log(`📧 Génération email avec BLOCS pour ${recipientEmail}`);
    return renderEmailFromBlocks(campaign.blocks, campaign.settings || {}, recipientEmail);
  }
  
  // Sinon, utiliser l'ancien système de templates
  console.log(`📧 Génération email avec TEMPLATE "${campaign.template}" pour ${recipientEmail}`);
  return generateMailingTemplate(campaign, recipientEmail);
};

// ==========================================
// CRUD CAMPAGNES
// ==========================================

// @desc    Créer une nouvelle campagne
// @route   POST /api/mailing
// @access  Private/Admin
const createCampaign = asyncHandler(async (req, res) => {
  const {
    name,
    subject,
    template,
    content,
    blocks,      // NOUVEAU: Support des blocs
    settings,    // NOUVEAU: Settings pour l'éditeur de blocs
    recipients,
    filters,
    scheduledAt,
  } = req.body;

  // Déterminer le type de template
  let templateType = template || "newsletter";
  if (blocks && blocks.length > 0) {
    templateType = "blocks";
  }

  const campaign = await MailingCampaign.create({
    name,
    subject,
    template: templateType,
    content: content || {},
    blocks: blocks || [],
    settings: settings || {},
    recipients: recipients || "all",
    filters: filters || {},
    scheduledAt: scheduledAt || null,
    status: scheduledAt ? "scheduled" : "draft",
    createdBy: req.user._id,
  });

  res.status(201).json(campaign);
});

// @desc    Récupérer toutes les campagnes
// @route   GET /api/mailing
// @access  Private/Admin
const getCampaigns = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    template,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (template) filter.template = template;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [campaigns, total] = await Promise.all([
    MailingCampaign.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email"),
    MailingCampaign.countDocuments(filter),
  ]);

  res.status(200).json({
    campaigns,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer une campagne par ID
// @route   GET /api/mailing/:id
// @access  Private/Admin
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id).populate(
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
// @route   PUT /api/mailing/:id
// @access  Private/Admin
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  // Impossible de modifier une campagne envoyée ou en cours
  if (campaign.status === "sent" || campaign.status === "sending") {
    res.status(400);
    throw new Error("Impossible de modifier une campagne déjà envoyée");
  }

  const {
    name,
    subject,
    template,
    content,
    blocks,
    settings,
    recipients,
    filters,
    scheduledAt,
    status,
  } = req.body;

  if (name) campaign.name = name;
  if (subject) campaign.subject = subject;
  if (template) campaign.template = template;
  if (content) campaign.content = { ...campaign.content, ...content };
  if (blocks !== undefined) {
    campaign.blocks = blocks;
    // Si on ajoute des blocs, changer le template en "blocks"
    if (blocks.length > 0) {
      campaign.template = "blocks";
    }
  }
  if (settings !== undefined) campaign.settings = { ...campaign.settings, ...settings };
  if (recipients) campaign.recipients = recipients;
  if (filters) campaign.filters = { ...campaign.filters, ...filters };
  if (scheduledAt !== undefined) campaign.scheduledAt = scheduledAt;
  if (status && !["sent", "sending"].includes(status)) campaign.status = status;

  const updatedCampaign = await campaign.save();

  res.status(200).json(updatedCampaign);
});

// @desc    Supprimer une campagne
// @route   DELETE /api/mailing/:id
// @access  Private/Admin
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  if (campaign.status === "sending") {
    res.status(400);
    throw new Error("Impossible de supprimer une campagne en cours d'envoi");
  }

  await campaign.deleteOne();

  res.status(200).json({ message: "Campagne supprimée avec succès" });
});

// @desc    Dupliquer une campagne
// @route   POST /api/mailing/:id/duplicate
// @access  Private/Admin
const duplicateCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  const duplicated = await MailingCampaign.create({
    name: `${campaign.name} (copie)`,
    subject: campaign.subject,
    template: campaign.template,
    content: campaign.content,
    blocks: campaign.blocks || [],
    settings: campaign.settings || {},
    recipients: campaign.recipients,
    filters: campaign.filters,
    status: "draft",
    createdBy: req.user._id,
  });

  res.status(201).json(duplicated);
});

// ==========================================
// RÉCUPÉRATION DES DESTINATAIRES
// ==========================================

const getRecipientEmails = async (recipients, filters) => {
  let emails = [];
  const emailSet = new Set();

  const getProspectEmails = async () => {
    const prospectFilter = { status: "active" };

    if (filters?.prospectStatus) {
      prospectFilter.status = filters.prospectStatus;
    }
    if (filters?.prospectSource) {
      prospectFilter.source = filters.prospectSource;
    }
    if (filters?.prospectTags?.length > 0) {
      prospectFilter.tags = { $in: filters.prospectTags };
    }

    const prospects = await Prospect.find(prospectFilter).select("email");
    return prospects.map((p) => p.email);
  };

  const getUserEmails = async (onlyNewsletterSubscribers = false) => {
    const userFilter = {};

    if (onlyNewsletterSubscribers || filters?.newsletterSubscribed) {
      userFilter.newsletterSubscribed = true;
    }
    if (filters?.isAdmin !== null && filters?.isAdmin !== undefined) {
      userFilter.isAdmin = filters.isAdmin;
    }

    const users = await User.find(userFilter).select("email");
    return users.map((u) => u.email);
  };

  switch (recipients) {
    case "prospects":
      emails = await getProspectEmails();
      break;

    case "users":
      emails = await getUserEmails(false);
      break;

    case "newsletter_subscribers":
      const [newsletterUsers, activeProspects] = await Promise.all([
        getUserEmails(true),
        getProspectEmails(),
      ]);
      emails = [...newsletterUsers, ...activeProspects];
      break;

    case "all":
    default:
      const [allUsers, allProspects] = await Promise.all([
        getUserEmails(true),
        getProspectEmails(),
      ]);
      emails = [...allUsers, ...allProspects];
      break;
  }

  emails.forEach((email) => emailSet.add(email.toLowerCase()));

  return Array.from(emailSet);
};

// ==========================================
// ENVOI DE CAMPAGNE
// ==========================================

// @desc    Envoyer une campagne
// @route   POST /api/mailing/:id/send
// @access  Private/Admin
const sendCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

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
    throw new Error("Cette campagne est déjà en cours d'envoi");
  }

  // Vérifier que la campagne a du contenu
  const hasBlocks = campaign.blocks && campaign.blocks.length > 0;
  const hasContent = campaign.content && campaign.content.body;
  
  if (!hasBlocks && !hasContent) {
    res.status(400);
    throw new Error("La campagne n'a pas de contenu. Ajoutez des blocs ou du contenu avant d'envoyer.");
  }

  // Récupérer les destinataires
  const emails = await getRecipientEmails(campaign.recipients, campaign.filters);

  if (emails.length === 0) {
    res.status(400);
    throw new Error("Aucun destinataire trouvé pour cette campagne");
  }

  // Mettre à jour le statut
  campaign.status = "sending";
  campaign.stats.totalRecipients = emails.length;
  await campaign.save();

  // Compteurs
  let sent = 0;
  let failed = 0;
  const errors = [];

  // Configuration des lots
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_BATCHES = 1000;

  console.log(`\n📧 ========================================`);
  console.log(`📧 ENVOI CAMPAGNE: "${campaign.name}"`);
  console.log(`📧 Type: ${hasBlocks ? 'BLOCS' : 'TEMPLATE (' + campaign.template + ')'}`);
  console.log(`📧 Destinataires: ${emails.length}`);
  console.log(`📧 ========================================\n`);

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async (email) => {
        // MODIFIÉ: Utilise la nouvelle fonction qui supporte les 2 systèmes
        const html = generateEmailHtml(campaign, email);
        await sendEmail({
          email,
          subject: campaign.subject,
          html,
        });
        return email;
      })
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        sent++;
        console.log(`✅ [${sent}/${emails.length}] Email envoyé à ${batch[index]}`);
      } else {
        failed++;
        errors.push({
          email: batch[index],
          error: result.reason?.message || "Erreur inconnue",
          timestamp: new Date(),
        });
        console.error(`❌ Erreur envoi à ${batch[index]}:`, result.reason?.message);
      }
    });

    // Pause entre les lots
    if (i + BATCH_SIZE < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }

  // Mettre à jour les stats finales
  campaign.status = failed === emails.length ? "failed" : "sent";
  campaign.sentAt = new Date();
  campaign.stats.sent = sent;
  campaign.stats.failed = failed;
  campaign.errors = errors.slice(0, 100);
  await campaign.save();

  console.log(`\n📧 ========================================`);
  console.log(`📧 CAMPAGNE TERMINÉE: "${campaign.name}"`);
  console.log(`📧 Envoyés: ${sent} | Échoués: ${failed}`);
  console.log(`📧 ========================================\n`);

  res.status(200).json({
    message: `Campagne envoyée`,
    stats: {
      totalRecipients: emails.length,
      sent,
      failed,
    },
  });
});

// @desc    Envoyer un email de test
// @route   POST /api/mailing/:id/test
// @access  Private/Admin
const sendTestEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email de test requis");
  }

  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  // Vérifier que la campagne a du contenu
  const hasBlocks = campaign.blocks && campaign.blocks.length > 0;
  const hasContent = campaign.content && campaign.content.body;
  
  if (!hasBlocks && !hasContent) {
    res.status(400);
    throw new Error("La campagne n'a pas de contenu. Ajoutez des blocs ou du contenu avant d'envoyer un test.");
  }

  try {
    // MODIFIÉ: Utilise la nouvelle fonction
    const html = generateEmailHtml(campaign, email);

    await sendEmail({
      email,
      subject: `[TEST] ${campaign.subject}`,
      html,
    });

    console.log(`✅ Email de test envoyé à ${email} pour la campagne "${campaign.name}"`);

    res.status(200).json({
      message: `Email de test envoyé à ${email}`,
    });
  } catch (error) {
    console.error(`❌ Erreur envoi test à ${email}:`, error.message);
    res.status(500);
    throw new Error(`Erreur lors de l'envoi: ${error.message}`);
  }
});

// @desc    Prévisualiser une campagne (retourne le HTML)
// @route   GET /api/mailing/:id/preview
// @access  Private/Admin
const previewCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  // MODIFIÉ: Utilise la nouvelle fonction
  const html = generateEmailHtml(campaign, "preview@example.com");

  res.status(200).json({
    html,
    subject: campaign.subject,
  });
});

// ==========================================
// STATISTIQUES
// ==========================================

// @desc    Obtenir les statistiques globales
// @route   GET /api/mailing/stats
// @access  Private/Admin
const getMailingStats = asyncHandler(async (req, res) => {
  const stats = await MailingCampaign.getGlobalStats();

  const activeProspects = await Prospect.countDocuments({ status: "active" });
  const newsletterUsers = await User.countDocuments({ newsletterSubscribed: true });
  const totalUsers = await User.countDocuments({});

  res.status(200).json({
    ...stats,
    potentialRecipients: {
      prospects: activeProspects,
      newsletterUsers,
      totalUsers,
      all: activeProspects + newsletterUsers,
    },
  });
});

// @desc    Obtenir les types de templates disponibles
// @route   GET /api/mailing/templates
// @access  Private/Admin
const getTemplateTypes = asyncHandler(async (req, res) => {
  res.status(200).json({
    ...templateLabels,
    blocks: { label: "Éditeur de blocs", icon: "🧱", color: "#6366f1" },
  });
});

// @desc    Obtenir les types de destinataires disponibles
// @route   GET /api/mailing/recipient-types
// @access  Private/Admin
const getRecipientTypes = asyncHandler(async (req, res) => {
  res.status(200).json(recipientLabels);
});

// @desc    Compter les destinataires selon les filtres
// @route   POST /api/mailing/count-recipients
// @access  Private/Admin
const countRecipients = asyncHandler(async (req, res) => {
  const { recipients, filters } = req.body;

  const emails = await getRecipientEmails(recipients || "all", filters || {});

  res.status(200).json({
    count: emails.length,
    recipients: recipients || "all",
  });
});

// @desc    Annuler une campagne programmée
// @route   PUT /api/mailing/:id/cancel
// @access  Private/Admin
const cancelCampaign = asyncHandler(async (req, res) => {
  const campaign = await MailingCampaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campagne non trouvée");
  }

  if (campaign.status !== "scheduled") {
    res.status(400);
    throw new Error("Seules les campagnes programmées peuvent être annulées");
  }

  campaign.status = "cancelled";
  campaign.scheduledAt = null;
  await campaign.save();

  res.status(200).json({
    message: "Campagne annulée",
    campaign,
  });
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
  getMailingStats,
  getTemplateTypes,
  getRecipientTypes,
  countRecipients,
  cancelCampaign,
};