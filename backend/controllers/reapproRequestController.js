import asyncHandler from "../middleware/asyncHandler.js";
import ReapproRequest from "../models/reapproRequestModel.js";
import ProOrder from "../models/proOrderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================================
// ROUTES PRO (Utilisateur Pro connecté)
// ==========================================

// @desc    Créer une demande de réapprovisionnement
// @route   POST /api/reappro-requests
// @access  Private/Pro
const createReapproRequest = asyncHandler(async (req, res) => {
  const {
    items,
    priority,
    requestedDeliveryDate,
    deliveryMethod,
    deliveryAddress,
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
    throw new Error("Aucun article dans la demande");
  }

  // Récupérer les infos des produits
  const reapproItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Produit non trouvé: ${item.product}`);
    }

    reapproItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      currentStock: item.currentStock || 0,
      requestedQuantity: item.requestedQuantity,
      approvedQuantity: 0,
      unitPrice: product.price,
      notes: item.notes || "",
    });
  }

  // Créer la demande
  const reapproRequest = await ReapproRequest.create({
    user: req.user._id,
    partnershipType: user.proInfo.partnershipType,
    items: reapproItems,
    priority: priority || "normal",
    status: "pending",
    requestedDeliveryDate: requestedDeliveryDate || null,
    deliveryMethod: deliveryMethod || "pickup",
    deliveryAddress: deliveryAddress || { useDefault: true },
    customerNotes: customerNotes || "",
    history: [
      {
        action: "Demande créée et soumise",
        status: "pending",
        note: "",
        date: new Date(),
        user: req.user._id,
      },
    ],
  });

  await reapproRequest.populate("user", "name email proInfo");
  await reapproRequest.populate("items.product", "name image");

  // Envoyer notification aux admins
  try {
    const admins = await User.find({ isAdmin: true }).select("email");
    const adminEmails = admins.map((a) => a.email);
    if (adminEmails.length > 0) {
      // TODO: Créer un template email pour les demandes de réappro
      console.log(`Notification envoyée aux admins: ${adminEmails.join(", ")}`);
    }
  } catch (error) {
    console.error("Erreur notification admin:", error);
  }

  res.status(201).json(reapproRequest);
});

// @desc    Obtenir mes demandes de réapprovisionnement
// @route   GET /api/reappro-requests/my-requests
// @access  Private/Pro
const getMyReapproRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  if (!req.user.isPro) {
    res.status(403);
    throw new Error("Accès réservé aux comptes professionnels");
  }

  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [requests, total] = await Promise.all([
    ReapproRequest.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("items.product", "name image"),
    ReapproRequest.countDocuments(filter),
  ]);

  res.json({
    requests,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Obtenir une demande par ID
// @route   GET /api/reappro-requests/:id
// @access  Private/Pro
const getReapproRequestById = asyncHandler(async (req, res) => {
  const request = await ReapproRequest.findById(req.params.id)
    .populate("user", "name email proInfo")
    .populate("items.product", "name image price countInStock")
    .populate("processedBy", "name email")
    .populate("generatedOrder")
    .populate("history.user", "name");

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  // Vérifier l'accès
  if (request.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Accès non autorisé");
  }

  res.json(request);
});

// @desc    Annuler ma demande (si encore pending)
// @route   PUT /api/reappro-requests/:id/cancel
// @access  Private/Pro
const cancelMyReapproRequest = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const request = await ReapproRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (request.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Accès non autorisé");
  }

  if (!["draft", "pending"].includes(request.status)) {
    res.status(400);
    throw new Error("Cette demande ne peut plus être annulée");
  }

  await request.cancel(req.user._id, reason);

  res.json({ message: "Demande annulée", request });
});

// @desc    Obtenir les stats de mes demandes
// @route   GET /api/reappro-requests/my-stats
// @access  Private/Pro
const getMyReapproStats = asyncHandler(async (req, res) => {
  if (!req.user.isPro) {
    res.status(403);
    throw new Error("Accès réservé aux comptes professionnels");
  }

  const stats = await ReapproRequest.getStats(req.user._id);
  res.json(stats);
});

// ==========================================
// ROUTES ADMIN
// ==========================================

// @desc    Obtenir toutes les demandes de réapprovisionnement
// @route   GET /api/reappro-requests
// @access  Private/Admin
const getAllReapproRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    partnershipType,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (partnershipType) filter.partnershipType = partnershipType;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [requests, total] = await Promise.all([
    ReapproRequest.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email proInfo")
      .populate("processedBy", "name"),
    ReapproRequest.countDocuments(filter),
  ]);

  res.json({
    requests,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Approuver une demande (avec quantités)
// @route   PUT /api/reappro-requests/:id/approve
// @access  Private/Admin
const approveReapproRequest = asyncHandler(async (req, res) => {
  const { items, note, estimatedDeliveryDate } = req.body;

  const request = await ReapproRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Cette demande a déjà été traitée");
  }

  // Mettre à jour les quantités approuvées
  if (items && items.length > 0) {
    for (const approvedItem of items) {
      const itemIndex = request.items.findIndex(
        (i) => i.product.toString() === approvedItem.product
      );
      if (itemIndex !== -1) {
        request.items[itemIndex].approvedQuantity = approvedItem.approvedQuantity;
      }
    }
  } else {
    // Approuver toutes les quantités demandées
    request.items.forEach((item) => {
      item.approvedQuantity = item.requestedQuantity;
    });
  }

  if (estimatedDeliveryDate) {
    request.estimatedDeliveryDate = estimatedDeliveryDate;
  }

  await request.approve(req.user._id, note);

  await request.populate("user", "name email proInfo");

  res.json({ message: "Demande approuvée", request });
});

// @desc    Rejeter une demande
// @route   PUT /api/reappro-requests/:id/reject
// @access  Private/Admin
const rejectReapproRequest = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const request = await ReapproRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Cette demande a déjà été traitée");
  }

  await request.reject(req.user._id, reason);

  res.json({ message: "Demande rejetée", request });
});

// @desc    Convertir une demande approuvée en commande Pro
// @route   POST /api/reappro-requests/:id/convert-to-order
// @access  Private/Admin
const convertToProOrder = asyncHandler(async (req, res) => {
  const request = await ReapproRequest.findById(req.params.id).populate("user");

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (!["approved", "partial"].includes(request.status)) {
    res.status(400);
    throw new Error("Seules les demandes approuvées peuvent être converties");
  }

  if (request.generatedOrder) {
    res.status(400);
    throw new Error("Cette demande a déjà été convertie en commande");
  }

  const user = await User.findById(request.user._id);

  // Créer les items de commande à partir des items approuvés
  const orderItems = [];
  let subtotal = 0;

  for (const item of request.items) {
    if (item.approvedQuantity > 0) {
      const proPrice = Math.round(
        item.unitPrice * (1 - user.proInfo.discountRate / 100)
      );
      const lineTotal = proPrice * item.approvedQuantity;

      orderItems.push({
        product: item.product,
        name: item.name,
        image: item.image,
        quantity: item.approvedQuantity,
        unitPrice: item.unitPrice,
        proPrice,
        lineTotal,
        notes: item.notes,
      });

      subtotal += lineTotal;
    }
  }

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error("Aucun article approuvé à convertir");
  }

  // Déterminer l'adresse de livraison
  let shippingAddress;
  if (request.deliveryAddress.useDefault) {
    shippingAddress = {
      companyName: user.proInfo.companyName,
      contactName: `${user.proInfo.contactFirstName} ${user.proInfo.contactLastName}`,
      street: user.proInfo.address.street,
      city: user.proInfo.address.city,
      postalCode: user.proInfo.address.postalCode,
      country: user.proInfo.address.country,
      phone: user.proInfo.contactPhone,
    };
  } else {
    shippingAddress = {
      companyName: request.deliveryAddress.companyName,
      contactName: request.deliveryAddress.contactName,
      street: request.deliveryAddress.street,
      city: request.deliveryAddress.city,
      postalCode: request.deliveryAddress.postalCode,
      country: request.deliveryAddress.country,
      phone: request.deliveryAddress.phone,
    };
  }

  // Calculer les frais de livraison
  let shippingCost = 0;
  if (request.deliveryMethod === "delivery") {
    shippingCost = subtotal >= 50000 ? 0 : 1500;
  }

  // Créer la commande Pro
  const proOrder = await ProOrder.create({
    user: request.user._id,
    orderType: request.partnershipType,
    items: orderItems,
    subtotal,
    discountRate: user.proInfo.discountRate,
    discountAmount: Math.round(
      orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0) -
        subtotal
    ),
    totalAmount: subtotal + shippingCost,
    shippingAddress,
    shippingMethod: request.deliveryMethod,
    shippingCost,
    paymentMethod: "invoice",
    paymentTerms: 30,
    status: "confirmed",
    confirmedAt: new Date(),
    customerNotes: request.customerNotes,
    processedBy: req.user._id,
    history: [
      {
        action: "Commande créée depuis demande de réappro",
        status: "confirmed",
        note: `Demande #${request.requestNumber}`,
        date: new Date(),
        user: req.user._id,
      },
    ],
  });

  // Mettre à jour la demande
  request.status = "completed";
  request.generatedOrder = proOrder._id;
  await request.addHistory(
    "Convertie en commande Pro",
    `Commande #${proOrder.orderNumber}`,
    req.user._id
  );

  await proOrder.populate("user", "name email proInfo");

  res.status(201).json({
    message: "Demande convertie en commande",
    request,
    order: proOrder,
  });
});

// @desc    Mettre à jour le statut d'une demande
// @route   PUT /api/reappro-requests/:id/status
// @access  Private/Admin
const updateReapproStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const request = await ReapproRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  const validStatuses = ["processing", "ready", "completed"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Statut invalide");
  }

  request.status = status;
  await request.addHistory(`Statut: ${status}`, note || "", req.user._id);

  res.json({ message: "Statut mis à jour", request });
});

// @desc    Ajouter des notes internes
// @route   PUT /api/reappro-requests/:id/notes
// @access  Private/Admin
const addReapproNotes = asyncHandler(async (req, res) => {
  const { internalNotes } = req.body;

  const request = await ReapproRequest.findByIdAndUpdate(
    req.params.id,
    { internalNotes },
    { new: true }
  );

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  res.json(request);
});

// @desc    Obtenir les statistiques globales
// @route   GET /api/reappro-requests/stats
// @access  Private/Admin
const getReapproStats = asyncHandler(async (req, res) => {
  const stats = await ReapproRequest.getStats();
  res.json(stats);
});

// @desc    Supprimer une demande
// @route   DELETE /api/reappro-requests/:id
// @access  Private/Admin
const deleteReapproRequest = asyncHandler(async (req, res) => {
  const request = await ReapproRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (!["draft", "cancelled", "rejected"].includes(request.status)) {
    res.status(400);
    throw new Error("Seules les demandes brouillon, annulées ou rejetées peuvent être supprimées");
  }

  await request.deleteOne();

  res.json({ message: "Demande supprimée" });
});

export {
  // Pro routes
  createReapproRequest,
  getMyReapproRequests,
  getReapproRequestById,
  cancelMyReapproRequest,
  getMyReapproStats,
  // Admin routes
  getAllReapproRequests,
  approveReapproRequest,
  rejectReapproRequest,
  convertToProOrder,
  updateReapproStatus,
  addReapproNotes,
  getReapproStats,
  deleteReapproRequest,
};