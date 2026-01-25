import asyncHandler from "../middleware/asyncHandler.js";
import VeilleCategory from "../models/VeilleCategoryModel.js";
import Veille from "../models/VeilleModel.js";

// ==========================================
// CATÉGORIES DE VEILLE - CRUD
// ==========================================

// @desc    Créer une nouvelle catégorie de veille
// @route   POST /api/veille-categories
// @access  Private/Admin
const createVeilleCategory = asyncHandler(async (req, res) => {
  const { name, description, color, icon, displayOrder } = req.body;

  // Vérifier si la catégorie existe déjà
  const existingCategory = await VeilleCategory.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error("Une catégorie avec ce nom existe déjà");
  }

  const category = await VeilleCategory.create({
    name,
    description,
    color,
    icon,
    displayOrder,
  });

  res.status(201).json(category);
});

// @desc    Récupérer toutes les catégories de veille
// @route   GET /api/veille-categories
// @access  Private/Admin
const getVeilleCategories = asyncHandler(async (req, res) => {
  const { includeCount = "true", activeOnly = "false" } = req.query;

  let categories;

  if (includeCount === "true") {
    categories = await VeilleCategory.getCategoriesWithCount();

    // Filtrer les catégories actives si demandé
    if (activeOnly === "true") {
      categories = categories.filter((cat) => cat.isActive);
    }
  } else {
    const filter = activeOnly === "true" ? { isActive: true } : {};
    categories = await VeilleCategory.find(filter).sort({
      displayOrder: 1,
      name: 1,
    });
  }

  res.status(200).json(categories);
});

// @desc    Récupérer une catégorie de veille par ID
// @route   GET /api/veille-categories/:id
// @access  Private/Admin
const getVeilleCategoryById = asyncHandler(async (req, res) => {
  const category = await VeilleCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }

  // Récupérer le nombre de veilles dans cette catégorie
  const veilleCount = await Veille.countDocuments({ category: category._id });

  res.status(200).json({
    ...category.toObject(),
    veilleCount,
  });
});

// @desc    Mettre à jour une catégorie de veille
// @route   PUT /api/veille-categories/:id
// @access  Private/Admin
const updateVeilleCategory = asyncHandler(async (req, res) => {
  const { name, description, color, icon, displayOrder, isActive } = req.body;

  const category = await VeilleCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }

  // Vérifier si le nouveau nom existe déjà (si modifié)
  if (name && name !== category.name) {
    const existingCategory = await VeilleCategory.findOne({ name });
    if (existingCategory) {
      res.status(400);
      throw new Error("Une catégorie avec ce nom existe déjà");
    }
  }

  category.name = name || category.name;
  category.description = description !== undefined ? description : category.description;
  category.color = color || category.color;
  category.icon = icon || category.icon;
  category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;
  category.isActive = isActive !== undefined ? isActive : category.isActive;

  const updatedCategory = await category.save();

  res.status(200).json(updatedCategory);
});

// @desc    Supprimer une catégorie de veille
// @route   DELETE /api/veille-categories/:id
// @access  Private/Admin
const deleteVeilleCategory = asyncHandler(async (req, res) => {
  const category = await VeilleCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }

  // Vérifier s'il y a des veilles dans cette catégorie
  const veilleCount = await Veille.countDocuments({ category: category._id });

  if (veilleCount > 0) {
    res.status(400);
    throw new Error(
      `Impossible de supprimer cette catégorie. Elle contient ${veilleCount} veille(s). Veuillez d'abord déplacer ou supprimer ces veilles.`
    );
  }

  await category.deleteOne();

  res.status(200).json({ message: "Catégorie supprimée avec succès" });
});

// @desc    Réorganiser l'ordre des catégories
// @route   PUT /api/veille-categories/reorder
// @access  Private/Admin
const reorderVeilleCategories = asyncHandler(async (req, res) => {
  const { categoryOrders } = req.body;
  // categoryOrders: [{ id: "xxx", displayOrder: 0 }, { id: "yyy", displayOrder: 1 }, ...]

  if (!categoryOrders || !Array.isArray(categoryOrders)) {
    res.status(400);
    throw new Error("Format de données invalide");
  }

  const bulkOps = categoryOrders.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { displayOrder: item.displayOrder },
    },
  }));

  await VeilleCategory.bulkWrite(bulkOps);

  const categories = await VeilleCategory.getCategoriesWithCount();

  res.status(200).json(categories);
});

export {
  createVeilleCategory,
  getVeilleCategories,
  getVeilleCategoryById,
  updateVeilleCategory,
  deleteVeilleCategory,
  reorderVeilleCategories,
};