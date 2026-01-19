import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Filtres
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { description_fr: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const status = req.query.status ? { status: req.query.status } : {};
  
  // Filtre par univers
  const universe = req.query.universe ? { universe: req.query.universe } : {};
  
  // Filtre par sous-univers
  const subUniverse = req.query.subUniverse ? { subUniverse: req.query.subUniverse } : {};

  // Filtres pour les nouveaux flags
  const isDestockage = req.query.isDestockage !== undefined 
    ? { isDestockage: req.query.isDestockage === "true" } 
    : {};
  const isComingSoon = req.query.isComingSoon !== undefined 
    ? { isComingSoon: req.query.isComingSoon === "true" } 
    : {};
  const isNewProduct = req.query.isNewProduct !== undefined 
    ? { isNewProduct: req.query.isNewProduct === "true" } 
    : {};
  const isFeatured = req.query.isFeatured !== undefined 
    ? { isFeatured: req.query.isFeatured === "true" } 
    : {};

  const filters = { 
    ...keyword, 
    ...category, 
    ...status, 
    ...universe, 
    ...subUniverse,
    ...isDestockage,
    ...isComingSoon,
    ...isNewProduct,
    ...isFeatured,
  };

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Get product stats
// @route   GET /api/products/stats
// @access  Public
const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ status: "active" });
  const draftProducts = await Product.countDocuments({ status: "draft" });
  const archivedProducts = await Product.countDocuments({ status: "archived" });
  const featuredProducts = await Product.countDocuments({ isFeatured: true });
  const outOfStock = await Product.countDocuments({ countInStock: 0 });
  const destockageProducts = await Product.countDocuments({ isDestockage: true });
  const comingSoonProducts = await Product.countDocuments({ isComingSoon: true });
  const newProducts = await Product.countDocuments({ isNewProduct: true });

  const byCategory = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Stats par univers
  const byUniverse = await Product.aggregate([
    {
      $group: { _id: "$universe", count: { $sum: 1 } },
    },
    {
      $lookup: {
        from: "universes",
        localField: "_id",
        foreignField: "_id",
        as: "universeInfo",
      },
    },
    {
      $unwind: {
        path: "$universeInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        name: { $ifNull: ["$universeInfo.name", "Sans univers"] },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Stats par sous-univers
  const bySubUniverse = await Product.aggregate([
    {
      $group: { _id: "$subUniverse", count: { $sum: 1 } },
    },
    {
      $lookup: {
        from: "subuniverses",
        localField: "_id",
        foreignField: "_id",
        as: "subUniverseInfo",
      },
    },
    {
      $unwind: {
        path: "$subUniverseInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        count: 1,
        name: { $ifNull: ["$subUniverseInfo.name", "Sans sous-univers"] },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({
    total: totalProducts,
    active: activeProducts,
    draft: draftProducts,
    archived: archivedProducts,
    featured: featuredProducts,
    outOfStock,
    destockage: destockageProducts,
    comingSoon: comingSoonProducts,
    newProducts,
    byCategory,
    byUniverse,
    bySubUniverse,
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description_fr,
    image,
    images,
    brand,
    color,
    weight,
    dimensions,
    plasticType,
    plasticOrigin,
    category,
    price,
    salePrice,
    countInStock,
    careInstructions,
    isNewProduct,
    isFeatured,
    isDestockage,
    isComingSoon,
    availableDate,
    status,
    tags,
    universe,
    subUniverse,
  } = req.body;

  const product = new Product({
    name,
    description_fr,
    image: image || "/images/sample.jpg",
    images: images || [],
    brand: brand || "Krysto",
    color,
    weight,
    dimensions,
    plasticType,
    plasticOrigin,
    category,
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : null,
    countInStock: Number(countInStock) || 0,
    careInstructions: careInstructions || "",
    isNewProduct: isNewProduct || false,
    isFeatured: isFeatured || false,
    isDestockage: isDestockage || false,
    isComingSoon: isComingSoon || false,
    availableDate: availableDate || null,
    status: status || "draft",
    tags: tags || [],
    universe: universe || null,
    subUniverse: subUniverse || null,
    user: req.user._id,
    reviews: [],
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  
  // Peupler l'univers et le sous-univers avant de renvoyer
  await createdProduct.populate("universe", "name slug image");
  await createdProduct.populate("subUniverse", "name slug image");
  
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description_fr,
    image,
    images,
    brand,
    color,
    weight,
    dimensions,
    plasticType,
    plasticOrigin,
    category,
    price,
    salePrice,
    countInStock,
    careInstructions,
    isNewProduct,
    isFeatured,
    isDestockage,
    isComingSoon,
    availableDate,
    status,
    tags,
    universe,
    subUniverse,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description_fr = description_fr || product.description_fr;
    product.image = image || product.image;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.color = color || product.color;
    product.weight = weight || product.weight;
    product.dimensions = dimensions || product.dimensions;
    product.plasticType = plasticType || product.plasticType;
    product.plasticOrigin = plasticOrigin || product.plasticOrigin;
    product.category = category || product.category;
    product.price = price !== undefined ? Number(price) : product.price;
    product.salePrice = salePrice ? Number(salePrice) : null;
    product.countInStock =
      countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.careInstructions =
      careInstructions !== undefined
        ? careInstructions
        : product.careInstructions;
    product.isNewProduct =
      isNewProduct !== undefined ? isNewProduct : product.isNewProduct;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isDestockage =
      isDestockage !== undefined ? isDestockage : product.isDestockage;
    product.isComingSoon =
      isComingSoon !== undefined ? isComingSoon : product.isComingSoon;
    product.availableDate =
      availableDate !== undefined ? availableDate : product.availableDate;
    product.status = status || product.status;
    product.tags = tags || product.tags;
    product.universe = universe !== undefined ? universe : product.universe;
    product.subUniverse = subUniverse !== undefined ? subUniverse : product.subUniverse;

    const updatedProduct = await product.save();
    
    // Peupler l'univers et le sous-univers avant de renvoyer
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Produit supprimé avec succès" });
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Toggle product featured status
// @route   PUT /api/products/:id/featured
// @access  Private/Admin
const toggleProductFeatured = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Toggle product destockage status
// @route   PUT /api/products/:id/destockage
// @access  Private/Admin
const toggleProductDestockage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isDestockage = !product.isDestockage;
    // Si on met en destockage, on enlève le "coming soon"
    if (product.isDestockage) {
      product.isComingSoon = false;
      product.availableDate = null;
    }
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Toggle product coming soon status
// @route   PUT /api/products/:id/coming-soon
// @access  Private/Admin
const toggleProductComingSoon = asyncHandler(async (req, res) => {
  const { availableDate } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isComingSoon = !product.isComingSoon;
    // Si on met en coming soon, on enlève le destockage
    if (product.isComingSoon) {
      product.isDestockage = false;
      product.availableDate = availableDate || null;
    } else {
      product.availableDate = null;
    }
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Update product status
// @route   PUT /api/products/:id/status
// @access  Private/Admin
const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    if (!["draft", "active", "archived"].includes(status)) {
      res.status(400);
      throw new Error("Statut invalide");
    }

    product.status = status;
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Update product universe
// @route   PUT /api/products/:id/universe
// @access  Private/Admin
const updateProductUniverse = asyncHandler(async (req, res) => {
  const { universe } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.universe = universe || null;
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Update product sub-universe
// @route   PUT /api/products/:id/subuniverse
// @access  Private/Admin
const updateProductSubUniverse = asyncHandler(async (req, res) => {
  const { subUniverse } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.subUniverse = subUniverse || null;
    const updatedProduct = await product.save();
    await updatedProduct.populate("universe", "name slug image");
    await updatedProduct.populate("subUniverse", "name slug image");
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Duplicate a product
// @route   POST /api/products/:id/duplicate
// @access  Private/Admin
const duplicateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const duplicatedProduct = new Product({
      name: `${product.name} (Copie)`,
      description_fr: product.description_fr,
      image: product.image,
      images: product.images,
      brand: product.brand,
      color: product.color,
      weight: product.weight,
      dimensions: product.dimensions,
      plasticType: product.plasticType,
      plasticOrigin: product.plasticOrigin,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice,
      countInStock: 0,
      careInstructions: product.careInstructions,
      isNewProduct: false,
      isFeatured: false,
      isDestockage: false,
      isComingSoon: false,
      availableDate: null,
      status: "draft",
      tags: product.tags,
      universe: product.universe,
      subUniverse: product.subUniverse,
      user: req.user._id,
      reviews: [],
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await duplicatedProduct.save();
    await createdProduct.populate("universe", "name slug image");
    await createdProduct.populate("subUniverse", "name slug image");
    res.status(201).json(createdProduct);
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Vous avez déjà donné votre avis sur ce produit");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Avis ajouté" });
  } else {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: "active", isComingSoon: false })
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .sort({ rating: -1 })
    .limit(4);
  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, status: "active" })
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .sort({ createdAt: -1 })
    .limit(8);
  res.json(products);
});

// @desc    Get destockage products
// @route   GET /api/products/destockage
// @access  Public
const getDestockageProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isDestockage: true, status: "active" })
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get coming soon products
// @route   GET /api/products/coming-soon
// @access  Public
const getComingSoonProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isComingSoon: true, status: "active" })
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .sort({ availableDate: 1, createdAt: -1 });
  res.json(products);
});

// @desc    Get new products
// @route   GET /api/products/new
// @access  Public
const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewProduct: true, status: "active", isComingSoon: false })
    .populate("universe", "name slug image")
    .populate("subUniverse", "name slug image")
    .sort({ createdAt: -1 })
    .limit(8);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  getProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  toggleProductDestockage,
  toggleProductComingSoon,
  updateProductStatus,
  updateProductUniverse,
  updateProductSubUniverse,
  duplicateProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getDestockageProducts,
  getComingSoonProducts,
  getNewProducts,
};