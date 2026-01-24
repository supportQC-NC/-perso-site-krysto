import asyncHandler from "../middleware/asyncHandler.js";
import MailingTemplate, {
  BLOCK_TYPES,
  BLOCK_LABELS,
  TEMPLATE_CATEGORIES,
  createDefaultBlock,
} from "../models/maillingTemplateModel.js";
import { renderEmailFromBlocks, renderBlock } from "../utils/blockMailRenderer.js";

// ==========================================
// CRUD TEMPLATES
// ==========================================

// @desc    Créer un nouveau template
// @route   POST /api/mailing-templates
// @access  Private/Admin
const createTemplate = asyncHandler(async (req, res) => {
  const { name, description, category, blocks, settings, tags, isPublic } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Le nom du template est obligatoire");
  }

  const template = await MailingTemplate.create({
    name,
    description: description || "",
    category: category || "custom",
    blocks: blocks || [],
    settings: settings || {},
    tags: tags || [],
    isPublic: isPublic || false,
    isDefault: false,
    createdBy: req.user._id,
  });

  res.status(201).json(template);
});

// @desc    Récupérer tous les templates (avec filtres)
// @route   GET /api/mailing-templates
// @access  Private/Admin
const getTemplates = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    search,
    type, // 'default', 'user', 'public', 'all'
    sortBy = "updatedAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};

  // Filtre par catégorie
  if (category && category !== "all") {
    filter.category = category;
  }

  // Filtre par type
  switch (type) {
    case "default":
      filter.isDefault = true;
      break;
    case "user":
      filter.createdBy = req.user._id;
      filter.isDefault = false;
      break;
    case "public":
      filter.isPublic = true;
      filter.isDefault = false;
      break;
    case "all":
    default:
      // Tous les templates accessibles : défaut + user + public
      filter.$or = [
        { isDefault: true },
        { createdBy: req.user._id },
        { isPublic: true },
      ];
      break;
  }

  // Recherche textuelle
  if (search) {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [templates, total] = await Promise.all([
    MailingTemplate.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .lean(),
    MailingTemplate.countDocuments(filter),
  ]);

  res.status(200).json({
    templates,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer les templates par défaut (système)
// @route   GET /api/mailing-templates/defaults
// @access  Private/Admin
const getDefaultTemplates = asyncHandler(async (req, res) => {
  const templates = await MailingTemplate.find({ isDefault: true })
    .sort({ category: 1, name: 1 })
    .lean();

  res.status(200).json(templates);
});

// @desc    Récupérer un template par ID
// @route   GET /api/mailing-templates/:id
// @access  Private/Admin
const getTemplateById = asyncHandler(async (req, res) => {
  const template = await MailingTemplate.findById(req.params.id)
    .populate("createdBy", "name email")
    .lean();

  if (!template) {
    res.status(404);
    throw new Error("Template non trouvé");
  }

  // Vérifier l'accès
  const hasAccess =
    template.isDefault ||
    template.isPublic ||
    template.createdBy?._id?.toString() === req.user._id.toString();

  if (!hasAccess) {
    res.status(403);
    throw new Error("Accès non autorisé à ce template");
  }

  res.status(200).json(template);
});

// @desc    Mettre à jour un template
// @route   PUT /api/mailing-templates/:id
// @access  Private/Admin
const updateTemplate = asyncHandler(async (req, res) => {
  const template = await MailingTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Template non trouvé");
  }

  // Impossible de modifier les templates par défaut
  if (template.isDefault) {
    res.status(400);
    throw new Error("Impossible de modifier un template par défaut. Dupliquez-le d'abord.");
  }

  // Vérifier que l'utilisateur est le propriétaire
  if (template.createdBy?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Vous n'êtes pas autorisé à modifier ce template");
  }

  const { name, description, category, blocks, settings, tags, isPublic, thumbnail } = req.body;

  if (name !== undefined) template.name = name;
  if (description !== undefined) template.description = description;
  if (category !== undefined) template.category = category;
  if (blocks !== undefined) template.blocks = blocks;
  if (settings !== undefined) template.settings = { ...template.settings, ...settings };
  if (tags !== undefined) template.tags = tags;
  if (isPublic !== undefined) template.isPublic = isPublic;
  if (thumbnail !== undefined) template.thumbnail = thumbnail;

  const updatedTemplate = await template.save();

  res.status(200).json(updatedTemplate);
});

// @desc    Supprimer un template
// @route   DELETE /api/mailing-templates/:id
// @access  Private/Admin
const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await MailingTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Template non trouvé");
  }

  // Impossible de supprimer les templates par défaut
  if (template.isDefault) {
    res.status(400);
    throw new Error("Impossible de supprimer un template par défaut");
  }

  // Vérifier que l'utilisateur est le propriétaire
  if (template.createdBy?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Vous n'êtes pas autorisé à supprimer ce template");
  }

  await template.deleteOne();

  res.status(200).json({ message: "Template supprimé avec succès" });
});

// @desc    Dupliquer un template
// @route   POST /api/mailing-templates/:id/duplicate
// @access  Private/Admin
const duplicateTemplate = asyncHandler(async (req, res) => {
  const template = await MailingTemplate.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Template non trouvé");
  }

  const { name } = req.body;
  const duplicated = template.duplicate(req.user._id, name);
  await duplicated.save();

  // Incrémenter le compteur d'utilisation du template original
  await MailingTemplate.incrementUsage(template._id);

  res.status(201).json(duplicated);
});

// ==========================================
// GESTION DES BLOCS
// ==========================================

// @desc    Récupérer les types de blocs disponibles
// @route   GET /api/mailing-templates/block-types
// @access  Private/Admin
const getBlockTypes = asyncHandler(async (req, res) => {
  res.status(200).json({
    types: BLOCK_TYPES,
    labels: BLOCK_LABELS,
  });
});

// @desc    Récupérer les catégories de templates
// @route   GET /api/mailing-templates/categories
// @access  Private/Admin
const getTemplateCategories = asyncHandler(async (req, res) => {
  res.status(200).json(TEMPLATE_CATEGORIES);
});

// @desc    Créer un bloc vide par défaut
// @route   POST /api/mailing-templates/create-block
// @access  Private/Admin
const createBlock = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (!type || !Object.values(BLOCK_TYPES).includes(type)) {
    res.status(400);
    throw new Error(`Type de bloc invalide. Types valides: ${Object.values(BLOCK_TYPES).join(", ")}`);
  }

  const block = createDefaultBlock(type);

  res.status(200).json(block);
});

// ==========================================
// PRÉVISUALISATION
// ==========================================

// @desc    Prévisualiser un template (retourne le HTML)
// @route   POST /api/mailing-templates/:id/preview
// @access  Private/Admin
const previewTemplate = asyncHandler(async (req, res) => {
  const template = await MailingTemplate.findById(req.params.id).lean();

  if (!template) {
    res.status(404);
    throw new Error("Template non trouvé");
  }

  const html = renderEmailFromBlocks(
    template.blocks,
    template.settings,
    "preview@example.com"
  );

  res.status(200).json({
    html,
    name: template.name,
  });
});

// @desc    Prévisualiser des blocs (sans sauvegarder)
// @route   POST /api/mailing-templates/preview-blocks
// @access  Private/Admin
const previewBlocks = asyncHandler(async (req, res) => {
  const { blocks, settings } = req.body;

  if (!blocks || !Array.isArray(blocks)) {
    res.status(400);
    throw new Error("Les blocs sont requis");
  }

  const html = renderEmailFromBlocks(
    blocks,
    settings || {},
    "preview@example.com"
  );

  res.status(200).json({ html });
});

// @desc    Prévisualiser un seul bloc
// @route   POST /api/mailing-templates/preview-block
// @access  Private/Admin
const previewSingleBlock = asyncHandler(async (req, res) => {
  const { block } = req.body;

  if (!block || !block.type) {
    res.status(400);
    throw new Error("Le bloc est requis");
  }

  const html = renderBlock(block, "preview@example.com");

  res.status(200).json({ html });
});

// ==========================================
// SEED DES TEMPLATES PAR DÉFAUT
// ==========================================

// @desc    Initialiser les templates par défaut
// @route   POST /api/mailing-templates/seed-defaults
// @access  Private/Admin
const seedDefaultTemplates = asyncHandler(async (req, res) => {
  // Import dynamique des templates par défaut
  const { defaultTemplates } = await import("../utils/defaultMailingTemplates.js");

  let created = 0;
  let skipped = 0;

  for (const templateData of defaultTemplates) {
    // Vérifier si le template existe déjà
    const exists = await MailingTemplate.findOne({
      name: templateData.name,
      isDefault: true,
    });

    if (exists) {
      skipped++;
      continue;
    }

    await MailingTemplate.create({
      ...templateData,
      isDefault: true,
      createdBy: null,
    });
    created++;
  }

  res.status(200).json({
    message: `Seed terminé: ${created} templates créés, ${skipped} ignorés (déjà existants)`,
    created,
    skipped,
  });
});

// ==========================================
// STATISTIQUES
// ==========================================

// @desc    Obtenir les statistiques des templates
// @route   GET /api/mailing-templates/stats
// @access  Private/Admin
const getTemplateStats = asyncHandler(async (req, res) => {
  const [
    totalTemplates,
    defaultTemplates,
    userTemplates,
    publicTemplates,
    categoryCounts,
    topUsed,
  ] = await Promise.all([
    MailingTemplate.countDocuments({}),
    MailingTemplate.countDocuments({ isDefault: true }),
    MailingTemplate.countDocuments({ createdBy: req.user._id, isDefault: false }),
    MailingTemplate.countDocuments({ isPublic: true, isDefault: false }),
    MailingTemplate.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    MailingTemplate.find({})
      .sort({ usageCount: -1 })
      .limit(5)
      .select("name category usageCount")
      .lean(),
  ]);

  res.status(200).json({
    totalTemplates,
    defaultTemplates,
    userTemplates,
    publicTemplates,
    categoryCounts: categoryCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    topUsed,
  });
});

export {
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
};