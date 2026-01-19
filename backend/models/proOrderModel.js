import mongoose from "mongoose";

// ==========================================
// SCHEMA DES ARTICLES DE COMMANDE PRO
// ==========================================
const proOrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La quantité minimum est 1"],
  },
  // Prix unitaire catalogue
  unitPrice: {
    type: Number,
    required: true,
  },
  // Prix unitaire après remise Pro
  proPrice: {
    type: Number,
    required: true,
  },
  // Sous-total pour cet article
  lineTotal: {
    type: Number,
    required: true,
  },
  // Notes spécifiques à l'article
  notes: {
    type: String,
    default: "",
  },
});

// ==========================================
// SCHEMA COMMANDE PRO
// ==========================================
const proOrderSchema = new mongoose.Schema(
  {
    // Référence unique de la commande
    orderNumber: {
      type: String,
      unique: true,
    },
    // Utilisateur Pro qui passe la commande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type de commande
    orderType: {
      type: String,
      enum: ["revendeur", "depot_vente"],
      required: true,
    },
    // Articles de la commande
    items: [proOrderItemSchema],
    // Totaux
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    // Remise appliquée (en %)
    discountRate: {
      type: Number,
      default: 0,
    },
    // Montant de la remise
    discountAmount: {
      type: Number,
      default: 0,
    },
    // Total final
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    // Adresse de livraison
    shippingAddress: {
      companyName: { type: String, required: true },
      contactName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "Nouvelle-Calédonie" },
      phone: { type: String, required: true },
    },
    // Mode de livraison
    shippingMethod: {
      type: String,
      enum: ["pickup", "delivery", "express"],
      default: "pickup",
    },
    // Frais de livraison
    shippingCost: {
      type: Number,
      default: 0,
    },
    // Mode de paiement
    paymentMethod: {
      type: String,
      enum: ["invoice", "transfer", "check", "cash"],
      default: "invoice",
    },
    // Conditions de paiement (jours)
    paymentTerms: {
      type: Number,
      default: 30, // 30 jours par défaut
    },
    // Statut de la commande
    status: {
      type: String,
      enum: [
        "draft",        // Brouillon
        "pending",      // En attente de validation
        "confirmed",    // Confirmée
        "processing",   // En préparation
        "ready",        // Prête pour enlèvement/livraison
        "shipped",      // Expédiée
        "delivered",    // Livrée
        "completed",    // Terminée (payée + livrée)
        "cancelled",    // Annulée
      ],
      default: "draft",
    },
    // Statut du paiement
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
    },
    // Montant déjà payé
    paidAmount: {
      type: Number,
      default: 0,
    },
    // Dates importantes
    confirmedAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    // Date d'échéance du paiement
    paymentDueDate: {
      type: Date,
      default: null,
    },
    // Référence de facture
    invoiceNumber: {
      type: String,
      default: "",
    },
    // Notes du client Pro
    customerNotes: {
      type: String,
      default: "",
    },
    // Notes internes (admin)
    internalNotes: {
      type: String,
      default: "",
    },
    // Historique des modifications
    history: [
      {
        action: String,
        status: String,
        note: String,
        date: { type: Date, default: Date.now },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // Admin qui a traité la commande
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==========================================
// INDEX
// ==========================================
proOrderSchema.index({ orderNumber: 1 });
proOrderSchema.index({ user: 1 });
proOrderSchema.index({ status: 1 });
proOrderSchema.index({ orderType: 1 });
proOrderSchema.index({ createdAt: -1 });
proOrderSchema.index({ user: 1, status: 1 });
proOrderSchema.index({ paymentStatus: 1, paymentDueDate: 1 });

// ==========================================
// VIRTUALS
// ==========================================

// Nombre total d'articles
proOrderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

// Montant restant à payer
proOrderSchema.virtual("remainingAmount").get(function () {
  return Math.max(0, this.totalAmount - this.paidAmount);
});

// Est en retard de paiement
proOrderSchema.virtual("isOverdue").get(function () {
  if (this.paymentStatus === "paid") return false;
  if (!this.paymentDueDate) return false;
  return new Date() > this.paymentDueDate;
});

// Labels
proOrderSchema.virtual("statusLabel").get(function () {
  const labels = {
    draft: "Brouillon",
    pending: "En attente",
    confirmed: "Confirmée",
    processing: "En préparation",
    ready: "Prête",
    shipped: "Expédiée",
    delivered: "Livrée",
    completed: "Terminée",
    cancelled: "Annulée",
  };
  return labels[this.status] || this.status;
});

proOrderSchema.virtual("paymentStatusLabel").get(function () {
  const labels = {
    pending: "En attente",
    partial: "Partiel",
    paid: "Payé",
    overdue: "En retard",
  };
  return labels[this.paymentStatus] || this.paymentStatus;
});

proOrderSchema.virtual("orderTypeLabel").get(function () {
  const labels = {
    revendeur: "Revendeur",
    depot_vente: "Dépôt-vente",
  };
  return labels[this.orderType] || this.orderType;
});

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================
proOrderSchema.pre("save", async function (next) {
  // Générer le numéro de commande si nouveau
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const prefix = this.orderType === "revendeur" ? "PRO" : "DV";
    const count = await mongoose.model("ProOrder").countDocuments({
      orderType: this.orderType,
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    });
    this.orderNumber = `${prefix}-${year}-${String(count + 1).padStart(5, "0")}`;
  }

  // Calculer la date d'échéance si confirmée
  if (this.isModified("status") && this.status === "confirmed" && !this.paymentDueDate) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + this.paymentTerms);
    this.paymentDueDate = dueDate;
  }

  next();
});

// ==========================================
// MÉTHODES
// ==========================================

// Ajouter une entrée à l'historique
proOrderSchema.methods.addHistory = function (action, note, userId) {
  this.history.push({
    action,
    status: this.status,
    note,
    date: new Date(),
    user: userId,
  });
  return this.save();
};

// Mettre à jour le statut
proOrderSchema.methods.updateStatus = function (newStatus, userId, note = "") {
  const oldStatus = this.status;
  this.status = newStatus;

  // Mettre à jour les dates selon le statut
  if (newStatus === "confirmed") this.confirmedAt = new Date();
  if (newStatus === "shipped") this.shippedAt = new Date();
  if (newStatus === "delivered") this.deliveredAt = new Date();
  if (newStatus === "completed") this.paidAt = new Date();

  this.history.push({
    action: `Statut: ${oldStatus} → ${newStatus}`,
    status: newStatus,
    note,
    date: new Date(),
    user: userId,
  });

  return this.save();
};

// Enregistrer un paiement
proOrderSchema.methods.recordPayment = function (amount, userId, note = "") {
  this.paidAmount += amount;

  if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = "paid";
    this.paidAt = new Date();
  } else if (this.paidAmount > 0) {
    this.paymentStatus = "partial";
  }

  this.history.push({
    action: `Paiement reçu: ${amount.toLocaleString()} XPF`,
    status: this.status,
    note,
    date: new Date(),
    user: userId,
  });

  return this.save();
};

// ==========================================
// MÉTHODES STATIQUES
// ==========================================

// Statistiques globales
proOrderSchema.statics.getStats = async function (userId = null) {
  const match = userId ? { user: userId } : {};

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  const byType = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$orderType",
        count: { $sum: 1 },
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalOrders = await this.countDocuments(match);
  const totalRevenue = await this.aggregate([
    { $match: { ...match, paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  const pendingPayments = await this.aggregate([
    { $match: { ...match, paymentStatus: { $in: ["pending", "partial"] } } },
    { $group: { _id: null, total: { $sum: { $subtract: ["$totalAmount", "$paidAmount"] } } } },
  ]);

  return {
    totalOrders,
    byStatus: stats,
    byType,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingPayments: pendingPayments[0]?.total || 0,
  };
};

const ProOrder = mongoose.model("ProOrder", proOrderSchema);

export default ProOrder;