import asyncHandler from "../middleware/asyncHandler.js";
import ProOrder from "../models/proOrderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================================
// ROUTES PRO (Utilisateur Pro connecté)
// ==========================================

// @desc    Créer une commande Pro
// @route   POST /api/pro-orders
// @access  Private/Pro
const createProOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    customerNotes,
  } = req.body;

  // Vérifier que l'utilisateur est Pro
  const user = await User.findById(req.user._id);
  if (!user.isPro) {
    res.status(403);
    throw new Error("Accès réservé aux comptes professionnels");
  }

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Aucun article dans la commande");
  }

  // Récupérer les infos des produits et calculer les prix
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Produit non trouvé: ${item.product}`);
    }

    // Calculer le prix Pro (avec remise)
    const unitPrice = product.price;
    const proPrice = Math.round(unitPrice * (1 - user.proInfo.discountRate / 100));
    const lineTotal = proPrice * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      quantity: item.quantity,
      unitPrice,
      proPrice,
      lineTotal,
      notes: item.notes || "",
    });

    subtotal += lineTotal;
  }

  // Calculer les totaux
  const discountRate = user.proInfo.discountRate;
  const discountAmount = Math.round(
    orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0) -
      subtotal
  );

  // Frais de livraison selon le mode
  let shippingCost = 0;
  if (shippingMethod === "delivery") {
    shippingCost = subtotal >= 50000 ? 0 : 1500; // Gratuit au-dessus de 50000 XPF
  } else if (shippingMethod === "express") {
    shippingCost = 3000;
  }

  const totalAmount = subtotal + shippingCost;

  // Créer l'adresse de livraison
  const finalShippingAddress = shippingAddress || {
    companyName: user.proInfo.companyName,
    contactName: `${user.proInfo.contactFirstName} ${user.proInfo.contactLastName}`,
    street: user.proInfo.address.street,
    city: user.proInfo.address.city,
    postalCode: user.proInfo.address.postalCode,
    country: user.proInfo.address.country,
    phone: user.proInfo.contactPhone,
  };

  // Créer la commande
  const proOrder = await ProOrder.create({
    user: req.user._id,
    orderType: user.proInfo.partnershipType,
    items: orderItems,
    subtotal,
    discountRate,
    discountAmount,
    totalAmount,
    shippingAddress: finalShippingAddress,
    shippingMethod: shippingMethod || "pickup",
    shippingCost,
    paymentMethod: paymentMethod || "invoice",
    paymentTerms: 30,
    status: "pending",
    customerNotes: customerNotes || "",
    history: [
      {
        action: "Commande créée",
        status: "pending",
        note: "",
        date: new Date(),
        user: req.user._id,
      },
    ],
  });

  // Peupler les références
  await proOrder.populate("user", "name email proInfo");
  await proOrder.populate("items.product", "name image");

  res.status(201).json(proOrder);
});

// @desc    Obtenir mes commandes Pro
// @route   GET /api/pro-orders/my-orders
// @access  Private/Pro
const getMyProOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Vérifier que l'utilisateur est Pro
  if (!req.user.isPro) {
    res.status(403);
    throw new Error("Accès réservé aux comptes professionnels");
  }

  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [orders, total] = await Promise.all([
    ProOrder.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("items.product", "name image"),
    ProOrder.countDocuments(filter),
  ]);

  res.json({
    orders,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Obtenir une commande Pro par ID
// @route   GET /api/pro-orders/:id
// @access  Private/Pro
const getProOrderById = asyncHandler(async (req, res) => {
  const order = await ProOrder.findById(req.params.id)
    .populate("user", "name email proInfo")
    .populate("items.product", "name image price")
    .populate("processedBy", "name email")
    .populate("history.user", "name");

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  // Vérifier que c'est bien la commande de l'utilisateur ou un admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Accès non autorisé");
  }

  res.json(order);
});

// @desc    Annuler ma commande Pro (si encore pending)
// @route   PUT /api/pro-orders/:id/cancel
// @access  Private/Pro
const cancelMyProOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await ProOrder.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  // Vérifier que c'est bien la commande de l'utilisateur
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Accès non autorisé");
  }

  // Seules les commandes en attente peuvent être annulées
  if (!["draft", "pending"].includes(order.status)) {
    res.status(400);
    throw new Error("Cette commande ne peut plus être annulée");
  }

  order.status = "cancelled";
  order.history.push({
    action: "Commande annulée par le client",
    status: "cancelled",
    note: reason || "",
    date: new Date(),
    user: req.user._id,
  });

  await order.save();

  res.json({ message: "Commande annulée", order });
});

// @desc    Obtenir les stats de mes commandes Pro
// @route   GET /api/pro-orders/my-stats
// @access  Private/Pro
const getMyProOrderStats = asyncHandler(async (req, res) => {
  if (!req.user.isPro) {
    res.status(403);
    throw new Error("Accès réservé aux comptes professionnels");
  }

  const stats = await ProOrder.getStats(req.user._id);
  res.json(stats);
});

// ==========================================
// ROUTES ADMIN
// ==========================================

// @desc    Obtenir toutes les commandes Pro
// @route   GET /api/pro-orders
// @access  Private/Admin
const getAllProOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    orderType,
    paymentStatus,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (orderType) filter.orderType = orderType;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [orders, total] = await Promise.all([
    ProOrder.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email proInfo")
      .populate("processedBy", "name"),
    ProOrder.countDocuments(filter),
  ]);

  res.json({
    orders,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Mettre à jour le statut d'une commande Pro
// @route   PUT /api/pro-orders/:id/status
// @access  Private/Admin
const updateProOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await ProOrder.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  const validStatuses = [
    "confirmed",
    "processing",
    "ready",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Statut invalide");
  }

  await order.updateStatus(status, req.user._id, note);

  await order.populate("user", "name email proInfo");

  res.json({ message: `Statut mis à jour: ${status}`, order });
});

// @desc    Enregistrer un paiement
// @route   PUT /api/pro-orders/:id/payment
// @access  Private/Admin
const recordProOrderPayment = asyncHandler(async (req, res) => {
  const { amount, note } = req.body;

  const order = await ProOrder.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Montant invalide");
  }

  if (amount > order.remainingAmount) {
    res.status(400);
    throw new Error(`Le montant dépasse le solde restant (${order.remainingAmount} XPF)`);
  }

  await order.recordPayment(amount, req.user._id, note);

  res.json({
    message: `Paiement de ${amount.toLocaleString()} XPF enregistré`,
    order,
  });
});

// @desc    Ajouter des notes internes
// @route   PUT /api/pro-orders/:id/notes
// @access  Private/Admin
const addProOrderNotes = asyncHandler(async (req, res) => {
  const { internalNotes } = req.body;

  const order = await ProOrder.findByIdAndUpdate(
    req.params.id,
    { internalNotes },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  res.json(order);
});

// @desc    Générer le numéro de facture
// @route   PUT /api/pro-orders/:id/invoice
// @access  Private/Admin
const generateInvoiceNumber = asyncHandler(async (req, res) => {
  const order = await ProOrder.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  if (order.invoiceNumber) {
    res.status(400);
    throw new Error("Cette commande a déjà un numéro de facture");
  }

  // Générer le numéro de facture
  const year = new Date().getFullYear();
  const count = await ProOrder.countDocuments({
    invoiceNumber: { $ne: "" },
    createdAt: {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    },
  });

  order.invoiceNumber = `FAC-${year}-${String(count + 1).padStart(5, "0")}`;
  await order.save();

  res.json({
    message: "Numéro de facture généré",
    invoiceNumber: order.invoiceNumber,
  });
});

// @desc    Obtenir les statistiques globales des commandes Pro
// @route   GET /api/pro-orders/stats
// @access  Private/Admin
const getProOrderStats = asyncHandler(async (req, res) => {
  const stats = await ProOrder.getStats();

  // Commandes en retard de paiement
  const overdueOrders = await ProOrder.countDocuments({
    paymentStatus: { $in: ["pending", "partial"] },
    paymentDueDate: { $lt: new Date() },
  });

  // Commandes à traiter aujourd'hui
  const pendingOrders = await ProOrder.countDocuments({
    status: { $in: ["pending", "confirmed"] },
  });

  res.json({
    ...stats,
    overdueOrders,
    pendingOrders,
  });
});

// @desc    Supprimer une commande Pro (brouillon uniquement)
// @route   DELETE /api/pro-orders/:id
// @access  Private/Admin
const deleteProOrder = asyncHandler(async (req, res) => {
  const order = await ProOrder.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  if (order.status !== "draft" && order.status !== "cancelled") {
    res.status(400);
    throw new Error("Seules les commandes brouillon ou annulées peuvent être supprimées");
  }

  await order.deleteOne();

  res.json({ message: "Commande supprimée" });
});

export {
  // Pro routes
  createProOrder,
  getMyProOrders,
  getProOrderById,
  cancelMyProOrder,
  getMyProOrderStats,
  // Admin routes
  getAllProOrders,
  updateProOrderStatus,
  recordProOrderPayment,
  addProOrderNotes,
  generateInvoiceNumber,
  getProOrderStats,
  deleteProOrder,
};