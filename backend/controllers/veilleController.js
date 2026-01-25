import asyncHandler from "../middleware/asyncHandler.js";
import Veille from "../models/VeilleModel.js";
import VeilleCategory from "../models/VeilleCategoryModel.js";

// ==========================================
// VEILLES - CRUD COMPLET
// ==========================================

// @desc    Créer une nouvelle veille
// @route   POST /api/veilles
// @access  Private/Admin
const createVeille = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    contentType,
    url,
    imageUrl,
    uploadedImage,
    category,
    tags,
    source,
    priority,
    notes,
    metadata,
  } = req.body;

  // Vérifier que la catégorie existe
  const categoryExists = await VeilleCategory.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Catégorie invalide");
  }

  // Validation selon le type de contenu
  if (contentType === "link" && !url) {
    res.status(400);
    throw new Error("L'URL est requise pour un lien");
  }

  if (contentType === "youtube" && !url) {
    res.status(400);
    throw new Error("L'URL YouTube est requise");
  }

  if (contentType === "image" && !imageUrl && !uploadedImage) {
    res.status(400);
    throw new Error("Une image (URL ou upload) est requise");
  }

  const veille = await Veille.create({
    user: req.user._id,
    title,
    description,
    contentType,
    url,
    imageUrl,
    uploadedImage,
    category,
    tags: tags || [],
    source,
    priority,
    notes,
    metadata,
  });

  // Peupler la catégorie pour la réponse
  await veille.populate("category", "name color icon");

  res.status(201).json(veille);
});

// @desc    Récupérer toutes les veilles avec filtres et pagination
// @route   GET /api/veilles
// @access  Private/Admin
const getVeilles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    contentType,
    status,
    priority,
    isFavorite,
    isArchived,
    search,
    tags,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Construire le filtre
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (contentType) {
    filter.contentType = contentType;
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (isFavorite !== undefined) {
    filter.isFavorite = isFavorite === "true";
  }

  if (isArchived !== undefined) {
    filter.isArchived = isArchived === "true";
  }

  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim());
    filter.tags = { $in: tagArray };
  }

  // Recherche textuelle
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { source: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [veilles, total] = await Promise.all([
    Veille.find(filter)
      .populate("category", "name color icon slug")
      .populate("user", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Veille.countDocuments(filter),
  ]);

  res.status(200).json({
    veilles,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    hasMore: skip + veilles.length < total,
  });
});

// @desc    Récupérer une veille par ID
// @route   GET /api/veilles/:id
// @access  Private/Admin
const getVeilleById = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id)
    .populate("category", "name color icon slug")
    .populate("user", "name email");

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  res.status(200).json(veille);
});

// @desc    Mettre à jour une veille
// @route   PUT /api/veilles/:id
// @access  Private/Admin
const updateVeille = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    contentType,
    url,
    imageUrl,
    uploadedImage,
    thumbnail,
    category,
    tags,
    source,
    priority,
    status,
    notes,
    metadata,
    isFavorite,
    isArchived,
  } = req.body;

  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  // Vérifier la catégorie si modifiée
  if (category && category !== veille.category.toString()) {
    const categoryExists = await VeilleCategory.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("Catégorie invalide");
    }
  }

  // Mettre à jour les champs
  veille.title = title || veille.title;
  veille.description = description !== undefined ? description : veille.description;
  veille.contentType = contentType || veille.contentType;
  veille.url = url !== undefined ? url : veille.url;
  veille.imageUrl = imageUrl !== undefined ? imageUrl : veille.imageUrl;
  veille.uploadedImage = uploadedImage !== undefined ? uploadedImage : veille.uploadedImage;
  veille.thumbnail = thumbnail !== undefined ? thumbnail : veille.thumbnail;
  veille.category = category || veille.category;
  veille.tags = tags !== undefined ? tags : veille.tags;
  veille.source = source !== undefined ? source : veille.source;
  veille.priority = priority || veille.priority;
  veille.status = status || veille.status;
  veille.notes = notes !== undefined ? notes : veille.notes;
  veille.isFavorite = isFavorite !== undefined ? isFavorite : veille.isFavorite;
  veille.isArchived = isArchived !== undefined ? isArchived : veille.isArchived;

  if (metadata) {
    veille.metadata = { ...veille.metadata, ...metadata };
  }

  const updatedVeille = await veille.save();
  await updatedVeille.populate("category", "name color icon slug");

  res.status(200).json(updatedVeille);
});

// @desc    Supprimer une veille
// @route   DELETE /api/veilles/:id
// @access  Private/Admin
const deleteVeille = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  await veille.deleteOne();

  res.status(200).json({ message: "Veille supprimée avec succès" });
});

// @desc    Supprimer plusieurs veilles
// @route   DELETE /api/veilles/bulk
// @access  Private/Admin
const deleteMultipleVeilles = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir les IDs des veilles à supprimer");
  }

  const result = await Veille.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    message: `${result.deletedCount} veille(s) supprimée(s) avec succès`,
    deletedCount: result.deletedCount,
  });
});

// ==========================================
// ACTIONS RAPIDES
// ==========================================

// @desc    Marquer une veille comme lue
// @route   PUT /api/veilles/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  await veille.markAsRead();
  await veille.populate("category", "name color icon");

  res.status(200).json(veille);
});

// @desc    Basculer le statut favori
// @route   PUT /api/veilles/:id/favorite
// @access  Private/Admin
const toggleFavorite = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  await veille.toggleFavorite();
  await veille.populate("category", "name color icon");

  res.status(200).json(veille);
});

// @desc    Archiver une veille
// @route   PUT /api/veilles/:id/archive
// @access  Private/Admin
const archiveVeille = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  await veille.archive();
  await veille.populate("category", "name color icon");

  res.status(200).json(veille);
});

// @desc    Désarchiver une veille
// @route   PUT /api/veilles/:id/unarchive
// @access  Private/Admin
const unarchiveVeille = asyncHandler(async (req, res) => {
  const veille = await Veille.findById(req.params.id);

  if (!veille) {
    res.status(404);
    throw new Error("Veille non trouvée");
  }

  await veille.unarchive();
  await veille.populate("category", "name color icon");

  res.status(200).json(veille);
});

// @desc    Déplacer des veilles vers une autre catégorie
// @route   PUT /api/veilles/move-category
// @access  Private/Admin
const moveToCategory = asyncHandler(async (req, res) => {
  const { veilleIds, categoryId } = req.body;

  if (!veilleIds || !Array.isArray(veilleIds) || veilleIds.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir les IDs des veilles");
  }

  // Vérifier que la catégorie existe
  const category = await VeilleCategory.findById(categoryId);
  if (!category) {
    res.status(400);
    throw new Error("Catégorie invalide");
  }

  const result = await Veille.updateMany(
    { _id: { $in: veilleIds } },
    { category: categoryId }
  );

  res.status(200).json({
    message: `${result.modifiedCount} veille(s) déplacée(s) vers "${category.name}"`,
    modifiedCount: result.modifiedCount,
  });
});

// @desc    Mettre à jour les tags de plusieurs veilles
// @route   PUT /api/veilles/bulk-tags
// @access  Private/Admin
const bulkUpdateTags = asyncHandler(async (req, res) => {
  const { veilleIds, tags, action = "add" } = req.body;
  // action: "add" (ajouter), "remove" (supprimer), "replace" (remplacer)

  if (!veilleIds || !Array.isArray(veilleIds) || veilleIds.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir les IDs des veilles");
  }

  if (!tags || !Array.isArray(tags)) {
    res.status(400);
    throw new Error("Veuillez fournir les tags");
  }

  let updateQuery;

  switch (action) {
    case "add":
      updateQuery = { $addToSet: { tags: { $each: tags } } };
      break;
    case "remove":
      updateQuery = { $pullAll: { tags: tags } };
      break;
    case "replace":
      updateQuery = { tags: tags };
      break;
    default:
      res.status(400);
      throw new Error("Action invalide. Utilisez 'add', 'remove' ou 'replace'");
  }

  const result = await Veille.updateMany({ _id: { $in: veilleIds } }, updateQuery);

  res.status(200).json({
    message: `Tags mis à jour pour ${result.modifiedCount} veille(s)`,
    modifiedCount: result.modifiedCount,
  });
});

// ==========================================
// STATISTIQUES ET RECHERCHE
// ==========================================

// @desc    Obtenir les statistiques des veilles
// @route   GET /api/veilles/stats
// @access  Private/Admin
const getVeilleStats = asyncHandler(async (req, res) => {
  const stats = await Veille.getStats();
  res.status(200).json(stats);
});

// @desc    Obtenir tous les tags utilisés
// @route   GET /api/veilles/tags
// @access  Private/Admin
const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Veille.aggregate([
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        tag: "$_id",
        count: 1,
      },
    },
  ]);

  res.status(200).json(tags);
});

// @desc    Récupérer les veilles récentes (dashboard)
// @route   GET /api/veilles/recent
// @access  Private/Admin
const getRecentVeilles = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const veilles = await Veille.find({ isArchived: false })
    .populate("category", "name color icon")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json(veilles);
});

// @desc    Récupérer les veilles favorites
// @route   GET /api/veilles/favorites
// @access  Private/Admin
const getFavoriteVeilles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [veilles, total] = await Promise.all([
    Veille.find({ isFavorite: true })
      .populate("category", "name color icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Veille.countDocuments({ isFavorite: true }),
  ]);

  res.status(200).json({
    veilles,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer les veilles par catégorie
// @route   GET /api/veilles/category/:categoryId
// @access  Private/Admin
const getVeillesByCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, contentType } = req.query;

  const filter = { category: req.params.categoryId };

  if (status) filter.status = status;
  if (contentType) filter.contentType = contentType;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [veilles, total, category] = await Promise.all([
    Veille.find(filter)
      .populate("category", "name color icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Veille.countDocuments(filter),
    VeilleCategory.findById(req.params.categoryId),
  ]);

  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }

  res.status(200).json({
    category,
    veilles,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

export {
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
};