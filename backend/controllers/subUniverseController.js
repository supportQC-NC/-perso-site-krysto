import asyncHandler from "../middleware/asyncHandler.js";
import SubUniverse from "../models/subUniverseModel.js";
import Universe from "../models/universeModel.js";
import Product from "../models/productModel.js";

// @desc    Récupérer tous les sous-univers
// @route   GET /api/subuniverses
// @access  Public
const getSubUniverses = asyncHandler(async (req, res) => {
  const { universe, isActive, sortBy = "displayOrder", sortOrder = "asc" } = req.query;

  const filter = {};
  
  if (universe) {
    filter.universe = universe;
  }
  
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const subUniverses = await SubUniverse.find(filter)
    .sort(sort)
    .populate("universe", "name slug image")
    .populate("productCount");

  res.status(200).json(subUniverses);
});

// @desc    Récupérer les sous-univers actifs
// @route   GET /api/subuniverses/active
// @access  Public
const getActiveSubUniverses = asyncHandler(async (req, res) => {
  const { universe } = req.query;
  
  const filter = { isActive: true };
  
  if (universe) {
    filter.universe = universe;
  }

  const subUniverses = await SubUniverse.find(filter)
    .sort({ displayOrder: 1 })
    .populate("universe", "name slug image")
    .populate("productCount");

  res.status(200).json(subUniverses);
});

// @desc    Récupérer les sous-univers d'un univers spécifique
// @route   GET /api/subuniverses/by-universe/:universeId
// @access  Public
const getSubUniversesByUniverse = asyncHandler(async (req, res) => {
  const { universeId } = req.params;
  const { isActive } = req.query;

  // Vérifier que l'univers existe
  const universe = await Universe.findById(universeId);
  if (!universe) {
    res.status(404);
    throw new Error("Univers non trouvé");
  }

  const filter = { universe: universeId };
  
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const subUniverses = await SubUniverse.find(filter)
    .sort({ displayOrder: 1 })
    .populate("productCount");

  res.status(200).json({
    universe,
    subUniverses,
  });
});

// @desc    Récupérer un sous-univers par ID
// @route   GET /api/subuniverses/:id
// @access  Public
const getSubUniverseById = asyncHandler(async (req, res) => {
  const subUniverse = await SubUniverse.findById(req.params.id)
    .populate("universe", "name slug image")
    .populate("productCount");

  if (!subUniverse) {
    res.status(404);
    throw new Error("Sous-univers non trouvé");
  }

  res.status(200).json(subUniverse);
});

// @desc    Récupérer un sous-univers par slug
// @route   GET /api/subuniverses/slug/:slug
// @access  Public
const getSubUniverseBySlug = asyncHandler(async (req, res) => {
  const subUniverse = await SubUniverse.findOne({ slug: req.params.slug })
    .populate("universe", "name slug image")
    .populate("productCount");

  if (!subUniverse) {
    res.status(404);
    throw new Error("Sous-univers non trouvé");
  }

  res.status(200).json(subUniverse);
});

// @desc    Récupérer les produits d'un sous-univers
// @route   GET /api/subuniverses/:id/products
// @access  Public
const getSubUniverseProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Vérifier que le sous-univers existe
  const subUniverse = await SubUniverse.findById(id).populate("universe", "name slug");
  if (!subUniverse) {
    res.status(404);
    throw new Error("Sous-univers non trouvé");
  }

  // Filtres
  const filters = { subUniverse: id };
  
  if (req.query.status) {
    filters.status = req.query.status;
  } else {
    filters.status = "active";
  }

  if (req.query.productType) {
    filters.productType = req.query.productType;
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.status(200).json({
    subUniverse,
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Créer un sous-univers
// @route   POST /api/subuniverses
// @access  Private/Admin
const createSubUniverse = asyncHandler(async (req, res) => {
  const { name, description, image, universe, isActive, displayOrder } = req.body;

  // Vérifier que l'univers parent existe
  const parentUniverse = await Universe.findById(universe);
  if (!parentUniverse) {
    res.status(404);
    throw new Error("Univers parent non trouvé");
  }

  // Vérifier si un sous-univers avec ce nom existe déjà dans cet univers
  const existingSubUniverse = await SubUniverse.findOne({ name, universe });
  if (existingSubUniverse) {
    res.status(400);
    throw new Error("Un sous-univers avec ce nom existe déjà dans cet univers");
  }

  const subUniverse = await SubUniverse.create({
    name,
    description,
    image,
    universe,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: displayOrder || 0,
  });

  await subUniverse.populate("universe", "name slug image");

  res.status(201).json(subUniverse);
});

// @desc    Mettre à jour un sous-univers
// @route   PUT /api/subuniverses/:id
// @access  Private/Admin
const updateSubUniverse = asyncHandler(async (req, res) => {
  const { name, description, image, universe, isActive, displayOrder } = req.body;

  const subUniverse = await SubUniverse.findById(req.params.id);

  if (!subUniverse) {
    res.status(404);
    throw new Error("Sous-univers non trouvé");
  }

  // Si l'univers change, vérifier qu'il existe
  if (universe && universe !== subUniverse.universe.toString()) {
    const parentUniverse = await Universe.findById(universe);
    if (!parentUniverse) {
      res.status(404);
      throw new Error("Univers parent non trouvé");
    }
  }

  // Si le nom change, vérifier l'unicité dans l'univers
  const targetUniverse = universe || subUniverse.universe;
  if (name && name !== subUniverse.name) {
    const existingSubUniverse = await SubUniverse.findOne({ 
      name, 
      universe: targetUniverse,
      _id: { $ne: subUniverse._id }
    });
    if (existingSubUniverse) {
      res.status(400);
      throw new Error("Un sous-univers avec ce nom existe déjà dans cet univers");
    }
  }

  subUniverse.name = name || subUniverse.name;
  subUniverse.description = description || subUniverse.description;
  subUniverse.image = image !== undefined ? image : subUniverse.image;
  subUniverse.universe = universe || subUniverse.universe;
  subUniverse.isActive = isActive !== undefined ? isActive : subUniverse.isActive;
  subUniverse.displayOrder = displayOrder !== undefined ? displayOrder : subUniverse.displayOrder;

  const updatedSubUniverse = await subUniverse.save();
  await updatedSubUniverse.populate("universe", "name slug image");

  res.status(200).json(updatedSubUniverse);
});

// @desc    Supprimer un sous-univers
// @route   DELETE /api/subuniverses/:id
// @access  Private/Admin
const deleteSubUniverse = asyncHandler(async (req, res) => {
  const subUniverse = await SubUniverse.findById(req.params.id);

  if (!subUniverse) {
    res.status(404);
    throw new Error("Sous-univers non trouvé");
  }

  // Vérifier qu'aucun produit n'est associé
  const canDelete = await SubUniverse.canDelete(req.params.id);

  if (!canDelete) {
    res.status(400);
    throw new Error(
      "Impossible de supprimer ce sous-univers car il contient des produits. Veuillez d'abord déplacer ou supprimer les produits associés."
    );
  }

  await subUniverse.deleteOne();

  res.status(200).json({ message: "Sous-univers supprimé avec succès" });
});

// @desc    Mettre à jour l'ordre d'affichage des sous-univers
// @route   PUT /api/subuniverses/reorder
// @access  Private/Admin
const reorderSubUniverses = asyncHandler(async (req, res) => {
  const { orders } = req.body; // Array of { id, displayOrder }

  if (!orders || !Array.isArray(orders)) {
    res.status(400);
    throw new Error("Format de données invalide");
  }

  const updatePromises = orders.map(({ id, displayOrder }) =>
    SubUniverse.findByIdAndUpdate(id, { displayOrder }, { new: true })
  );

  await Promise.all(updatePromises);

  const subUniverses = await SubUniverse.find()
    .sort({ displayOrder: 1 })
    .populate("universe", "name slug image");

  res.status(200).json(subUniverses);
});

// @desc    Obtenir les statistiques des sous-univers
// @route   GET /api/subuniverses/stats
// @access  Private/Admin
const getSubUniverseStats = asyncHandler(async (req, res) => {
  const totalSubUniverses = await SubUniverse.countDocuments();
  const activeSubUniverses = await SubUniverse.countDocuments({ isActive: true });
  const inactiveSubUniverses = await SubUniverse.countDocuments({ isActive: false });

  // Sous-univers par univers
  const subUniversesByUniverse = await SubUniverse.aggregate([
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

  // Produits par sous-univers
  const productsBySubUniverse = await Product.aggregate([
    {
      $match: { subUniverse: { $ne: null } },
    },
    {
      $group: {
        _id: "$subUniverse",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "subuniverses",
        localField: "_id",
        foreignField: "_id",
        as: "subUniverse",
      },
    },
    {
      $unwind: {
        path: "$subUniverse",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        name: { $ifNull: ["$subUniverse.name", "Sans sous-univers"] },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Produits sans sous-univers
  const productsWithoutSubUniverse = await Product.countDocuments({
    $or: [{ subUniverse: null }, { subUniverse: { $exists: false } }],
  });

  res.status(200).json({
    total: totalSubUniverses,
    active: activeSubUniverses,
    inactive: inactiveSubUniverses,
    subUniversesByUniverse,
    productsBySubUniverse,
    productsWithoutSubUniverse,
  });
});

export {
  getSubUniverses,
  getActiveSubUniverses,
  getSubUniversesByUniverse,
  getSubUniverseById,
  getSubUniverseBySlug,
  getSubUniverseProducts,
  createSubUniverse,
  updateSubUniverse,
  deleteSubUniverse,
  reorderSubUniverses,
  getSubUniverseStats,
};
