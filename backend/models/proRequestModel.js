import mongoose from "mongoose";

const proRequestSchema = new mongoose.Schema(
  {
    // Référence à l'utilisateur qui fait la demande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Informations personnelles
    firstName: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Le téléphone est requis"],
      trim: true,
    },
    // Informations entreprise
    companyName: {
      type: String,
      required: [true, "Le nom de l'entreprise est requis"],
      trim: true,
    },
    legalStatus: {
      type: String,
      required: [true, "La raison sociale est requise"],
      trim: true,
      // Exemples : SARL, SAS, EI, Auto-entrepreneur, etc.
    },
    ripidetNumber: {
      type: String,
      required: [true, "Le numéro RIDET est requis"],
      trim: true,
      // RIDET = Répertoire d'Identification des Entreprises et des Établissements (Nouvelle-Calédonie)
    },
    // Adresse de l'entreprise
    address: {
      street: {
        type: String,
        required: [true, "L'adresse est requise"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "La ville est requise"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Le code postal est requis"],
        trim: true,
      },
      country: {
        type: String,
        default: "Nouvelle-Calédonie",
        trim: true,
      },
    },
    // Type de partenariat souhaité
    partnershipType: {
      type: String,
      required: [true, "Le type de partenariat est requis"],
      enum: {
        values: ["revendeur", "depot_vente"],
        message: "{VALUE} n'est pas un type de partenariat valide",
      },
    },
    // Message optionnel de l'utilisateur
    message: {
      type: String,
      default: "",
      maxlength: [1000, "Le message ne peut pas dépasser 1000 caractères"],
    },
    // Statut de la demande
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    // Informations de traitement
    processedAt: {
      type: Date,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Raison du refus (si rejeté)
    rejectionReason: {
      type: String,
      default: "",
    },
    // Notes admin
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour améliorer les performances
proRequestSchema.index({ user: 1 });
proRequestSchema.index({ status: 1 });
proRequestSchema.index({ createdAt: -1 });
proRequestSchema.index({ status: 1, createdAt: -1 });
proRequestSchema.index({ ridetNumber: 1 });

// Virtual pour le nom complet
proRequestSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour l'adresse formatée
proRequestSchema.virtual("formattedAddress").get(function () {
  return `${this.address.street}, ${this.address.postalCode} ${this.address.city}, ${this.address.country}`;
});

// Virtual pour le label du type de partenariat
proRequestSchema.virtual("partnershipTypeLabel").get(function () {
  const labels = {
    revendeur: "Revendeur",
    depot_vente: "Dépôt-vente",
  };
  return labels[this.partnershipType] || this.partnershipType;
});

// Méthode pour approuver la demande
proRequestSchema.methods.approve = function (adminId) {
  this.status = "approved";
  this.processedAt = new Date();
  this.processedBy = adminId;
  return this.save();
};

// Méthode pour rejeter la demande
proRequestSchema.methods.reject = function (adminId, reason = "") {
  this.status = "rejected";
  this.processedAt = new Date();
  this.processedBy = adminId;
  this.rejectionReason = reason;
  return this.save();
};

// Méthode statique pour obtenir les statistiques
proRequestSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const pending = await this.countDocuments({ status: "pending" });
  const approved = await this.countDocuments({ status: "approved" });
  const rejected = await this.countDocuments({ status: "rejected" });
  const cancelled = await this.countDocuments({ status: "cancelled" });

  const byPartnershipType = await this.aggregate([
    { $group: { _id: "$partnershipType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Demandes des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRequests = await this.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  return {
    total,
    pending,
    approved,
    rejected,
    cancelled,
    byPartnershipType,
    recentRequests,
  };
};

const ProRequest = mongoose.model("ProRequest", proRequestSchema);

export default ProRequest;