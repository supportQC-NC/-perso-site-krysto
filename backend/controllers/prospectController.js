import asyncHandler from "../middleware/asyncHandler.js";
import Prospect from "../models/prospectModel.js";

// ==========================================
// PUBLIC ROUTES
// ==========================================

// @desc    S'inscrire à la newsletter
// @route   POST /api/prospects
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, source } = req.body;

  // Vérifier si déjà inscrit
  const existingProspect = await Prospect.findOne({ email: email.toLowerCase() });

  if (existingProspect) {
    // Si désabonné, réactiver
    if (existingProspect.status === "unsubscribed") {
      existingProspect.status = "active";
      existingProspect.subscribedAt = new Date();
      existingProspect.unsubscribedAt = null;
      await existingProspect.save();

      return res.status(200).json({
        message: "Votre inscription a été réactivée !",
        prospect: existingProspect,
      });
    }

    res.status(400);
    throw new Error("Cet email est déjà inscrit à la newsletter");
  }

  // Créer le nouveau prospect
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "";

  const prospect = await Prospect.create({
    email: email.toLowerCase(),
    source: source || "landing_page",
    ipAddress,
    userAgent,
  });

  res.status(201).json({
    message: "Inscription réussie ! Bienvenue dans la communauté Krysto.",
    prospect,
  });
});

// @desc    Se désabonner de la newsletter
// @route   PUT /api/prospects/unsubscribe
// @access  Public
const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const prospect = await Prospect.findOne({ email: email.toLowerCase() });

  if (!prospect) {
    res.status(404);
    throw new Error("Email non trouvé");
  }

  if (prospect.status === "unsubscribed") {
    res.status(400);
    throw new Error("Cet email est déjà désabonné");
  }

  await prospect.unsubscribe();

  res.status(200).json({
    message: "Désabonnement effectué avec succès",
  });
});

// @desc    Vérifier le statut d'inscription
// @route   GET /api/prospects/check/:email
// @access  Public
const checkSubscriptionStatus = asyncHandler(async (req, res) => {
  const { email } = req.params;

  const prospect = await Prospect.findOne({ email: email.toLowerCase() });

  if (!prospect) {
    return res.status(200).json({
      subscribed: false,
      status: null,
    });
  }

  res.status(200).json({
    subscribed: prospect.status === "active",
    status: prospect.status,
  });
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// @desc    Récupérer tous les prospects
// @route   GET /api/prospects
// @access  Private/Admin
const getProspects = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    source,
    sortBy = "subscribedAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [prospects, total] = await Promise.all([
    Prospect.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("convertedToUser", "name email"),
    Prospect.countDocuments(filter),
  ]);

  res.status(200).json({
    prospects,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer un prospect par ID
// @route   GET /api/prospects/:id
// @access  Private/Admin
const getProspectById = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id).populate(
    "convertedToUser",
    "name email"
  );

  if (!prospect) {
    res.status(404);
    throw new Error("Prospect non trouvé");
  }

  res.status(200).json(prospect);
});

// @desc    Mettre à jour un prospect
// @route   PUT /api/prospects/:id
// @access  Private/Admin
const updateProspect = asyncHandler(async (req, res) => {
  const { email, status, tags } = req.body;

  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    res.status(404);
    throw new Error("Prospect non trouvé");
  }

  if (email) prospect.email = email.toLowerCase();
  if (status) {
    prospect.status = status;
    if (status === "unsubscribed" && !prospect.unsubscribedAt) {
      prospect.unsubscribedAt = new Date();
    }
  }
  if (tags !== undefined) prospect.tags = tags;

  const updatedProspect = await prospect.save();

  res.status(200).json(updatedProspect);
});

// @desc    Supprimer un prospect
// @route   DELETE /api/prospects/:id
// @access  Private/Admin
const deleteProspect = asyncHandler(async (req, res) => {
  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    res.status(404);
    throw new Error("Prospect non trouvé");
  }

  await prospect.deleteOne();

  res.status(200).json({ message: "Prospect supprimé avec succès" });
});

// @desc    Supprimer plusieurs prospects
// @route   DELETE /api/prospects/bulk
// @access  Private/Admin
const bulkDeleteProspects = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir une liste d'IDs");
  }

  const result = await Prospect.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    message: `${result.deletedCount} prospect(s) supprimé(s)`,
    deletedCount: result.deletedCount,
  });
});

// @desc    Obtenir les statistiques des prospects
// @route   GET /api/prospects/stats
// @access  Private/Admin
const getProspectStats = asyncHandler(async (req, res) => {
  const stats = await Prospect.getStats();

  res.status(200).json(stats);
});

// @desc    Marquer un prospect comme converti
// @route   PUT /api/prospects/:id/convert
// @access  Private/Admin
const markProspectAsConverted = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const prospect = await Prospect.findById(req.params.id);

  if (!prospect) {
    res.status(404);
    throw new Error("Prospect non trouvé");
  }

  await prospect.markAsConverted(userId);

  res.status(200).json({
    message: "Prospect marqué comme converti",
    prospect,
  });
});

// @desc    Ajouter des tags à plusieurs prospects
// @route   PUT /api/prospects/bulk/tags
// @access  Private/Admin
const bulkAddTagsToProspects = asyncHandler(async (req, res) => {
  const { ids, tags } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir une liste d'IDs");
  }

  if (!tags || !Array.isArray(tags)) {
    res.status(400);
    throw new Error("Veuillez fournir une liste de tags");
  }

  const result = await Prospect.updateMany(
    { _id: { $in: ids } },
    { $addToSet: { tags: { $each: tags } } }
  );

  res.status(200).json({
    message: `Tags ajoutés à ${result.modifiedCount} prospect(s)`,
    modifiedCount: result.modifiedCount,
  });
});

// @desc    Exporter les prospects (liste d'emails)
// @route   GET /api/prospects/export
// @access  Private/Admin
const exportProspects = asyncHandler(async (req, res) => {
  const { status, source } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;

  const prospects = await Prospect.find(filter)
    .select("email status source subscribedAt tags")
    .sort({ subscribedAt: -1 });

  res.status(200).json({
    count: prospects.length,
    prospects,
  });
});

export {
  // Public
  subscribeNewsletter,
  unsubscribeNewsletter,
  checkSubscriptionStatus,
  // Admin
  getProspects,
  getProspectById,
  updateProspect,
  deleteProspect,
  bulkDeleteProspects,
  getProspectStats,
  markProspectAsConverted,
  bulkAddTagsToProspects,
  exportProspects,
};
