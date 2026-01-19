import mongoose from "mongoose";

// ==========================================
// SCHEMA DES ARTICLES DE RÉAPPRO
// ==========================================
const reapproItemSchema = new mongoose.Schema({
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
  // Quantité actuellement en stock chez le Pro
  currentStock: {
    type: Number,
    required: true,
    min: 0,
  },
  // Quantité demandée
  requestedQuantity: {
    type: Number,
    required: true,
    min: [1, "La quantité minimum est 1"],
  },
  // Quantité validée par l'admin (peut différer)
  approvedQuantity: {
    type: Number,
    default: 0,
  },
  // Prix unitaire
  unitPrice: {
    type: Number,
    required: true,
  },
  // Notes
  notes: {
    type: String,
    default: "",
  },
});

// ==========================================
// SCHEMA DEMANDE DE RÉAPPROVISIONNEMENT
// ==========================================
const reapproRequestSchema = new mongoose.Schema(
  {
    // Référence unique
    requestNumber: {
      type: String,
      unique: true,
    },
    // Utilisateur Pro qui fait la demande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Type de partenariat
    partnershipType: {
      type: String,
      enum: ["revendeur", "depot_vente"],
      required: true,
    },
    // Articles demandés
    items: [reapproItemSchema],
    // Priorité de la demande
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    // Statut de la demande
    status: {
      type: String,
      enum: [
        "draft",        // Brouillon
        "pending",      // En attente de validation
        "approved",     // Approuvée
        "partial",      // Partiellement approuvée
        "processing",   // En cours de traitement
        "ready",        // Prête
        "completed",    // Terminée (livrée)
        "rejected",     // Rejetée
        "cancelled",    // Annulée par le client
      ],
      default: "draft",
    },
    // Raison du rejet (si rejetée)
    rejectionReason: {
      type: String,
      default: "",
    },
    // Date souhaitée de livraison
    requestedDeliveryDate: {
      type: Date,
      default: null,
    },
    // Date estimée de livraison
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },
    // Mode de livraison souhaité
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "pickup",
    },
    // Adresse de livraison (si différente de l'adresse Pro par défaut)
    deliveryAddress: {
      useDefault: { type: Boolean, default: true },
      companyName: { type: String },
      contactName: { type: String },
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Nouvelle-Calédonie" },
      phone: { type: String },
    },
    // Notes du client
    customerNotes: {
      type: String,
      default: "",
      maxlength: [1000, "Les notes ne peuvent pas dépasser 1000 caractères"],
    },
    // Notes internes (admin)
    internalNotes: {
      type: String,
      default: "",
    },
    // Référence à la commande Pro générée (si approuvée)
    generatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProOrder",
      default: null,
    },
    // Historique
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
    // Admin qui a traité la demande
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    processedAt: {
      type: Date,
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
reapproRequestSchema.index({ requestNumber: 1 });
reapproRequestSchema.index({ user: 1 });
reapproRequestSchema.index({ status: 1 });
reapproRequestSchema.index({ priority: 1 });
reapproRequestSchema.index({ createdAt: -1 });
reapproRequestSchema.index({ user: 1, status: 1 });

// ==========================================
// VIRTUALS
// ==========================================

// Nombre total d'articles demandés
reapproRequestSchema.virtual("totalRequestedItems").get(function () {
  return this.items.reduce((acc, item) => acc + item.requestedQuantity, 0);
});

// Nombre total d'articles approuvés
reapproRequestSchema.virtual("totalApprovedItems").get(function () {
  return this.items.reduce((acc, item) => acc + item.approvedQuantity, 0);
});

// Labels
reapproRequestSchema.virtual("statusLabel").get(function () {
  const labels = {
    draft: "Brouillon",
    pending: "En attente",
    approved: "Approuvée",
    partial: "Partiellement approuvée",
    processing: "En cours",
    ready: "Prête",
    completed: "Terminée",
    rejected: "Rejetée",
    cancelled: "Annulée",
  };
  return labels[this.status] || this.status;
});

reapproRequestSchema.virtual("priorityLabel").get(function () {
  const labels = {
    low: "Basse",
    normal: "Normale",
    high: "Haute",
    urgent: "Urgente",
  };
  return labels[this.priority] || this.priority;
});

reapproRequestSchema.virtual("priorityColor").get(function () {
  const colors = {
    low: "#6c757d",
    normal: "#17a2b8",
    high: "#fd7e14",
    urgent: "#dc3545",
  };
  return colors[this.priority] || "#17a2b8";
});

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================
reapproRequestSchema.pre("save", async function (next) {
  // Générer le numéro de demande si nouveau
  if (!this.requestNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const count = await mongoose.model("ReapproRequest").countDocuments({
      createdAt: {
        $gte: new Date(year, new Date().getMonth(), 1),
        $lt: new Date(year, new Date().getMonth() + 1, 1),
      },
    });
    this.requestNumber = `REA-${year}${month}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// ==========================================
// MÉTHODES
// ==========================================

// Ajouter une entrée à l'historique
reapproRequestSchema.methods.addHistory = function (action, note, userId) {
  this.history.push({
    action,
    status: this.status,
    note,
    date: new Date(),
    user: userId,
  });
  return this.save();
};

// Soumettre la demande
reapproRequestSchema.methods.submit = function (userId) {
  this.status = "pending";
  return this.addHistory("Demande soumise", "", userId);
};

// Approuver la demande
reapproRequestSchema.methods.approve = function (adminId, note = "") {
  // Vérifier si toutes les quantités sont approuvées
  const allApproved = this.items.every(
    (item) => item.approvedQuantity === item.requestedQuantity
  );
  const someApproved = this.items.some((item) => item.approvedQuantity > 0);

  if (allApproved) {
    this.status = "approved";
  } else if (someApproved) {
    this.status = "partial";
  }

  this.processedBy = adminId;
  this.processedAt = new Date();

  return this.addHistory("Demande approuvée", note, adminId);
};

// Rejeter la demande
reapproRequestSchema.methods.reject = function (adminId, reason = "") {
  this.status = "rejected";
  this.rejectionReason = reason;
  this.processedBy = adminId;
  this.processedAt = new Date();

  return this.addHistory("Demande rejetée", reason, adminId);
};

// Annuler la demande (par le client)
reapproRequestSchema.methods.cancel = function (userId, reason = "") {
  this.status = "cancelled";
  return this.addHistory("Demande annulée", reason, userId);
};

// Marquer comme terminée
reapproRequestSchema.methods.complete = function (adminId, orderId = null) {
  this.status = "completed";
  if (orderId) this.generatedOrder = orderId;
  return this.addHistory("Demande terminée", "", adminId);
};

// ==========================================
// MÉTHODES STATIQUES
// ==========================================

// Statistiques
reapproRequestSchema.statics.getStats = async function (userId = null) {
  const match = userId ? { user: userId } : {};

  const byStatus = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const byPriority = await this.aggregate([
    { $match: { ...match, status: "pending" } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await this.countDocuments(match);
  const pending = await this.countDocuments({ ...match, status: "pending" });
  const urgent = await this.countDocuments({
    ...match,
    status: "pending",
    priority: "urgent",
  });

  return {
    total,
    pending,
    urgent,
    byStatus,
    byPriority,
  };
};

const ReapproRequest = mongoose.model("ReapproRequest", reapproRequestSchema);

export default ReapproRequest;