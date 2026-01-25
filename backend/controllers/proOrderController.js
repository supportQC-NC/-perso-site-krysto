import asyncHandler from "../middleware/asyncHandler.js";
import ProOrder from "../models/proOrderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import {
  proOrderConfirmationTemplate,
  proOrderStatusUpdateTemplate,
  proPaymentReminderTemplate,
} from "../utils/emailTemplates.js";

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

  // ========================================
  // ENVOI EMAIL CONFIRMATION COMMANDE PRO
  // ========================================
  try {
    await sendEmail({
      email: user.proInfo.contactEmail || user.email,
      subject: `🏢 Commande Pro #${proOrder._id.toString().slice(-8).toUpperCase()} confirmée !`,
      html: proOrderConfirmationTemplate(proOrder, user),
    });
    console.log(`✅ Email de confirmation commande Pro envoyé à ${user.proInfo.contactEmail || user.email}`);
  } catch (error) {
    console.error("❌ Erreur envoi email confirmation commande Pro:", error.message);
  }

  // ========================================
  // NOTIFICATION AUX ADMINS
  // ========================================
  try {
    const admins = await User.find({ isAdmin: true }).select("email");
    const adminEmails = admins.map((admin) => admin.email);

    if (adminEmails.length > 0) {
      await sendEmail({
        email: adminEmails.join(","),
        subject: `🏢 Nouvelle commande Pro - ${user.proInfo.companyName} - ${totalAmount.toLocaleString()} XPF`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #e3f2fd; padding: 30px; border-radius: 12px;">
              <h2 style="color: #1976d2;">🏢 Nouvelle commande Pro</h2>
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p><strong>Client :</strong> ${user.proInfo.companyName}</p>
                <p><strong>Type :</strong> ${user.proInfo.partnershipType === 'revendeur' ? 'Revendeur' : 'Dépôt-vente'}</p>
                <p><strong>Montant :</strong> ${totalAmount.toLocaleString()} XPF</p>
                <p><strong>Articles :</strong> ${orderItems.length}</p>
                <p><strong>Remise appliquée :</strong> ${discountRate}%</p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/pro-orders/${proOrder._id}" 
                   style="background: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px;">
                  Voir la commande →
                </a>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      console.log("✅ Notification admin envoyée pour nouvelle commande Pro");
    }
  } catch (error) {
    console.error("❌ Erreur notification admin commande Pro:", error.message);
  }

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

  const order = await ProOrder.findById(req.params.id).populate("user", "name email proInfo");

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  // Vérifier que c'est bien la commande de l'utilisateur
  if (order.user._id.toString() !== req.user._id.toString()) {
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

  // ========================================
  // ENVOI EMAIL ANNULATION
  // ========================================
  try {
    await sendEmail({
      email: order.user.proInfo?.contactEmail || order.user.email,
      subject: `❌ Commande Pro #${order._id.toString().slice(-8).toUpperCase()} annulée`,
      html: proOrderStatusUpdateTemplate(order, order.user, "cancelled", reason),
    });
    console.log(`✅ Email d'annulation commande Pro envoyé`);
  } catch (error) {
    console.error("❌ Erreur envoi email annulation:", error.message);
  }

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

  const order = await ProOrder.findById(req.params.id).populate("user", "name email proInfo");

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

  // ========================================
  // ENVOI EMAIL MISE À JOUR STATUT
  // ========================================
  try {
    const statusLabels = {
      confirmed: "Confirmée",
      processing: "En préparation",
      ready: "Prête",
      shipped: "Expédiée",
      delivered: "Livrée",
      completed: "Terminée",
      cancelled: "Annulée",
    };

    await sendEmail({
      email: order.user.proInfo?.contactEmail || order.user.email,
      subject: `🏢 Commande Pro #${order._id.toString().slice(-8).toUpperCase()} - ${statusLabels[status] || status}`,
      html: proOrderStatusUpdateTemplate(order, order.user, status, note),
    });
    console.log(`✅ Email de mise à jour statut Pro envoyé (${status})`);
  } catch (error) {
    console.error("❌ Erreur envoi email statut Pro:", error.message);
  }

  res.json({ message: `Statut mis à jour: ${status}`, order });
});

// @desc    Enregistrer un paiement
// @route   PUT /api/pro-orders/:id/payment
// @access  Private/Admin
const recordProOrderPayment = asyncHandler(async (req, res) => {
  const { amount, note } = req.body;

  const order = await ProOrder.findById(req.params.id).populate("user", "name email proInfo");

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

  // ========================================
  // ENVOI EMAIL CONFIRMATION PAIEMENT
  // ========================================
  try {
    await sendEmail({
      email: order.user.proInfo?.contactEmail || order.user.email,
      subject: `💳 Paiement reçu - Commande Pro #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #e8f5e9; padding: 30px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 48px;">💳</span>
              <h2 style="color: #4caf50; margin: 10px 0;">Paiement reçu</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="font-size: 14px; color: #666;">Montant reçu</p>
              <p style="font-size: 32px; font-weight: bold; color: #4caf50; margin: 10px 0;">
                ${amount.toLocaleString()} XPF
              </p>
              <p style="font-size: 14px; color: #666;">
                Commande #${order._id.toString().slice(-8).toUpperCase()}
              </p>
              ${order.remainingAmount > 0 ? `
              <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
                Solde restant : <strong>${order.remainingAmount.toLocaleString()} XPF</strong>
              </p>
              ` : `
              <p style="margin-top: 15px; padding: 10px; background: #c8e6c9; border-radius: 8px; color: #2e7d32; font-weight: bold;">
                ✓ Commande entièrement payée
              </p>
              `}
            </div>
            <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
              Merci pour votre confiance !<br>L'équipe Krysto Pro 🏢
            </p>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`✅ Email confirmation paiement Pro envoyé`);
  } catch (error) {
    console.error("❌ Erreur envoi email paiement Pro:", error.message);
  }

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

// @desc    Envoyer un rappel de paiement
// @route   POST /api/pro-orders/:id/payment-reminder
// @access  Private/Admin
const sendPaymentReminder = asyncHandler(async (req, res) => {
  const order = await ProOrder.findById(req.params.id).populate("user", "name email proInfo");

  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  if (order.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Cette commande est déjà payée");
  }

  // Calculer les jours de retard
  const daysOverdue = order.paymentDueDate 
    ? Math.max(0, Math.floor((new Date() - new Date(order.paymentDueDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  // ========================================
  // ENVOI EMAIL RAPPEL PAIEMENT
  // ========================================
  try {
    await sendEmail({
      email: order.user.proInfo?.contactEmail || order.user.email,
      subject: `💳 Rappel de paiement - Commande Pro #${order._id.toString().slice(-8).toUpperCase()}`,
      html: proPaymentReminderTemplate(order, order.user, daysOverdue),
    });
    console.log(`✅ Email de rappel paiement Pro envoyé`);
    
    // Enregistrer dans l'historique
    order.history.push({
      action: "Rappel de paiement envoyé",
      status: order.status,
      note: `Rappel envoyé par email (${daysOverdue > 0 ? `${daysOverdue} jours de retard` : 'à échéance'})`,
      date: new Date(),
      user: req.user._id,
    });
    await order.save();
  } catch (error) {
    console.error("❌ Erreur envoi rappel paiement:", error.message);
    res.status(500);
    throw new Error("Impossible d'envoyer le rappel de paiement");
  }

  res.json({
    message: "Rappel de paiement envoyé",
    order,
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
  sendPaymentReminder,
  getProOrderStats,
  deleteProOrder,
};