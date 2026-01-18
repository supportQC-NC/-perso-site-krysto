import asyncHandler from "../middleware/asyncHandler.js";
import Universe from "../models/universeModel.js";
import Product from "../models/productModel.js";

// @desc    Récupérer tous les univers
// @route   GET /api/universes
// @access  Public
const getUniverses = asyncHandler(async (req, res) => {
  const { isActive, sortBy = "displayOrder", sortOrder = "asc" } = req.query;

  const filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const universes = await Universe.find(filter)
    .sort(sort)
    .populate("productCount");

  res.status(200).json(universes);
});

// @desc    Récupérer les univers actifs (pour la page d'accueil)
// @route   GET /api/universes/active
// @access  Public
const getActiveUniverses = asyncHandler(async (req, res) => {
  const universes = await Universe.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .populate("productCount");

  res.status(200).json(universes);
});

// @desc    Récupérer un univers par ID
// @route   GET /api/universes/:id
// @access  Public
const getUniverseById = asyncHandler(async (req, res) => {
  const universe = await Universe.findById(req.params.id).populate(
    "productCount"
  );

  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  res.status(200).json(universe);
});

// @desc    Récupérer un univers par slug
// @route   GET /api/universes/slug/:slug
// @access  Public
const getUniverseBySlug = asyncHandler(async (req, res) => {
  const universe = await Universe.findOne({ slug: req.params.slug }).populate(
    "productCount"
  );

  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  res.status(200).json(universe);
});

// @desc    Récupérer les produits d'un univers
// @route   GET /api/universes/:id/products
// @access  Public
const getUniverseProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Vérifier que l'univers existe
  const universe = await Universe.findById(id);
  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  // Filtres supplémentaires
  const filters = { universe: id };
  
  if (req.query.status) {
    filters.status = req.query.status;
  } else {
    // Par défaut, ne montrer que les produits actifs pour le public
    filters.status = "active";
  }

  if (req.query.productType) {
    filters.productType = req.query.productType;
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.status(200).json({
    universe,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Créer un univers
// @route   POST /api/universes
// @access  Private/Admin
const createUniverse = asyncHandler(async (req, res) => {
  const { name, description, image, isActive, displayOrder } = req.body;

  // Vérifier si un univers avec ce nom existe déjà
  const existingUniverse = await Universe.findOne({ name });
  if (existingUniverse) {
    res.status(400);
    throw new Error("Un univers avec ce nom existe déjà");
  }

  const universe = await Universe.create({
    name,
    description,
    image,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
  });

  res.status(201).json(universe);
});

// @desc    Mettre à jour un univers
// @route   PUT /api/universes/:id
// @access  Private/Admin
const updateUniverse = asyncHandler(async (req, res) => {
  const { name, description, image, isActive, displayOrder } = req.body;

  const universe = await Universe.findById(req.params.id);

  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  // Si le nom change, vérifier qu'il n'existe pas déjà
  if (name && name !== universe.name) {
    const existingUniverse = await Universe.findOne({ name });
    if (existingUniverse) {
      res.status(400);
      throw new Error("Un univers avec ce nom existe déjà");
    }
  }

  universe.name = name || universe.name;
  universe.description = description || universe.description;
  universe.image = image || universe.image;
  universe.isActive = isActive !== undefined ? isActive : universe.isActive;
  universe.displayOrder =
    displayOrder !== undefined ? displayOrder : universe.displayOrder;

  const updatedUniverse = await universe.save();

  res.status(200).json(updatedUniverse);
});

// @desc    Supprimer un univers
// @route   DELETE /api/universes/:id
// @access  Private/Admin
const deleteUniverse = asyncHandler(async (req, res) => {
  const universe = await Universe.findById(req.params.id);

  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  // Vérifier qu'aucun produit n'est associé à cet univers
  const canDelete = await Universe.canDelete(req.params.id);

  if (!canDelete) {
    res.status(400);
    throw new Error(
      "Impossible de supprimer cet univers car il contient des produits. Veuillez d'abord déplacer ou supprimer les produits associés."
    );
  }

  await universe.deleteOne();

  res.status(200).json({ message: "Univers supprimé avec succès" });
});

// @desc    Mettre à jour l'ordre d'affichage des univers
// @route   PUT /api/universes/reorder
// @access  Private/Admin
const reorderUniverses = asyncHandler(async (req, res) => {
  const { orders } = req.body; // Array of { id, displayOrder }

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error("Format de données invalide");
  }

  const updatePromises = orders.map(({ id, displayOrder }) =>
    Universe.findByIdAndUpdate(id, { displayOrder }, { new: true })
  );

  await Promise.all(updatePromises);

  const universes = await Universe.find().sort({ displayOrder: 1 });

  res.status(200).json(universes);
});

// @desc    Obtenir les statistiques des univers
// @route   GET /api/universes/stats
// @access  Private/Admin
const getUniverseStats = asyncHandler(async (req, res) => {
  const totalUniverses = await Universe.countDocuments();
  const activeUniverses = await Universe.countDocuments({ isActive: true });
  const inactiveUniverses = await Universe.countDocuments({ isActive: false });

  // Produits par univers
  const productsByUniverse = await Product.aggregate([
    {
      $group: {
        _id: "$universe",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "universes",
        localField: "_id",
        foreignField: "_id",
        as: "universe",
      },
    },
    {
      $unwind: {
        path: "$universe",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        name: { $ifNull: ["$universe.name", "Sans univers"] },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Produits sans univers
  const productsWithoutUniverse = await Product.countDocuments({
    $or: [{ universe: null }, { universe: { $exists: false } }],
  });

  res.status(200).json({
    total: totalUniverses,
    active: activeUniverses,
    inactive: inactiveUniverses,
    productsByUniverse,
    productsWithoutUniverse,
  });
});

export {
  getUniverses,
  getActiveUniverses,
  getUniverseById,
  getUniverseBySlug,
  getUniverseProducts,
  createUniverse,
  updateUniverse,
  deleteUniverse,
  reorderUniverses,
  getUniverseStats,
};