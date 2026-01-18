import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";
import { orderConfirmationTemplate } from "../utils/emailTemplates.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Aucun article dans la commande");
  }

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
      _id: undefined,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Récupérer la commande avec les infos utilisateur pour l'email
  const populatedOrder = await Order.findById(createdOrder._id).populate(
    "user",
    "name email"
  );

  // Envoyer l'email de confirmation
  try {
    await sendEmail({
      email: populatedOrder.user.email,
      subject: `Commande #${populatedOrder._id} confirmée ! ✅`,
      html: orderConfirmationTemplate(populatedOrder),
    });
  } catch (error) {
    console.log("Erreur envoi email de commande:", error);
  }

  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Non autorisé");
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Commande non trouvée");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "Confirmée";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Commande non trouvée");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Livrée";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Commande non trouvée");
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;

    // Mettre à jour les flags selon le statut
    if (status === "Livrée") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === "Annulée") {
      order.isDelivered = false;
      order.deliveredAt = null;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Commande non trouvée");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const { status, isPaid, isDelivered } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (isPaid !== undefined) {
    query.isPaid = isPaid === "true";
  }

  if (isDelivered !== undefined) {
    query.isDelivered = isDelivered === "true";
  }

  const orders = await Order.find(query)
    .populate("user", "id name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  // Total des commandes
  const totalOrders = await Order.countDocuments();

  // Commandes par statut
  const pendingOrders = await Order.countDocuments({ status: "En attente" });
  const processingOrders = await Order.countDocuments({ status: "En préparation" });
  const deliveredOrders = await Order.countDocuments({ status: "Livrée" });

  // Revenus
  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Revenus du mois
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyRevenueResult = await Order.aggregate([
    { $match: { isPaid: true, paidAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

  // Commandes récentes
  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    totalRevenue,
    monthlyRevenue,
    recentOrders,
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.json({ message: "Commande supprimée" });
  } else {
    res.status(404);
    throw new Error("Commande non trouvée");
  }
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders,
  getOrderStats,
  deleteOrder,
};