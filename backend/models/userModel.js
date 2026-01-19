import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir une adresse email valide",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // ==========================================
    // CHAMPS PRO
    // ==========================================
    isPro: {
      type: Boolean,
      default: false,
    },
    proStatus: {
      type: String,
      enum: ["none", "pending", "approved", "suspended"],
      default: "none",
    },
    proInfo: {
      // Informations entreprise (remplies lors de l'approbation)
      companyName: {
        type: String,
        default: "",
      },
      legalStatus: {
        type: String,
        default: "",
      },
      ridetNumber: {
        type: String,
        default: "",
      },
      // Type de partenariat
      partnershipType: {
        type: String,
        enum: ["revendeur", "depot_vente", ""],
        default: "",
      },
      // Adresse professionnelle
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "Nouvelle-Calédonie" },
      },
      // Contact pro
      contactPhone: {
        type: String,
        default: "",
      },
      contactEmail: {
        type: String,
        default: "",
      },
      contactFirstName: {
        type: String,
        default: "",
      },
      contactLastName: {
        type: String,
        default: "",
      },
      // Remise accordée (en pourcentage)
      discountRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      // Date de passage en Pro
      approvedAt: {
        type: Date,
        default: null,
      },
      // Admin qui a approuvé
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      // Notes internes (visibles uniquement par les admins)
      adminNotes: {
        type: String,
        default: "",
      },
    },
    // ==========================================
    // NEWSLETTER
    // ==========================================
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    newsletterSubscribedAt: {
      type: Date,
      default: null,
    },
    newsletterUnsubscribedAt: {
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
// VIRTUALS
// ==========================================

// Label du type de partenariat
userSchema.virtual("partnershipTypeLabel").get(function () {
  if (!this.isPro || !this.proInfo?.partnershipType) return "";
  const labels = {
    revendeur: "Revendeur",
    depot_vente: "Dépôt-vente",
  };
  return labels[this.proInfo.partnershipType] || this.proInfo.partnershipType;
});

// Nom complet du contact pro
userSchema.virtual("proContactFullName").get(function () {
  if (!this.proInfo?.contactFirstName && !this.proInfo?.contactLastName) return "";
  return `${this.proInfo.contactFirstName || ""} ${this.proInfo.contactLastName || ""}`.trim();
});

// ==========================================
// MIDDLEWARE
// ==========================================

// Mise à jour des dates newsletter
userSchema.pre("save", async function () {
  if (this.isModified("newsletterSubscribed")) {
    if (this.newsletterSubscribed) {
      this.newsletterSubscribedAt = new Date();
      this.newsletterUnsubscribedAt = null;
    } else if (this.newsletterSubscribedAt) {
      this.newsletterUnsubscribedAt = new Date();
    }
  }
});

// ==========================================
// MÉTHODES
// ==========================================

// Passer l'utilisateur en Pro
userSchema.methods.setAsPro = function (proData, adminId) {
  this.isPro = true;
  this.proStatus = "approved";
  this.proInfo = {
    companyName: proData.companyName || "",
    legalStatus: proData.legalStatus || "",
    ridetNumber: proData.ridetNumber || "",
    partnershipType: proData.partnershipType || "",
    address: {
      street: proData.address?.street || "",
      city: proData.address?.city || "",
      postalCode: proData.address?.postalCode || "",
      country: proData.address?.country || "Nouvelle-Calédonie",
    },
    contactPhone: proData.phone || proData.contactPhone || "",
    contactEmail: proData.email || proData.contactEmail || "",
    contactFirstName: proData.firstName || proData.contactFirstName || "",
    contactLastName: proData.lastName || proData.contactLastName || "",
    discountRate: proData.discountRate || 0,
    approvedAt: new Date(),
    approvedBy: adminId,
    adminNotes: proData.adminNotes || "",
  };
  return this.save();
};

// Retirer le statut Pro
userSchema.methods.removePro = function () {
  this.isPro = false;
  this.proStatus = "none";
  // On conserve les infos dans proInfo pour historique
  return this.save();
};

// Suspendre le compte Pro
userSchema.methods.suspendPro = function () {
  this.isPro = false;
  this.proStatus = "suspended";
  return this.save();
};

// Réactiver le compte Pro
userSchema.methods.reactivatePro = function () {
  if (this.proStatus === "suspended") {
    this.isPro = true;
    this.proStatus = "approved";
  }
  return this.save();
};

// ==========================================
// MÉTHODES STATIQUES
// ==========================================

// Obtenir les statistiques des utilisateurs Pro
userSchema.statics.getProStats = async function () {
  const totalUsers = await this.countDocuments();
  const totalPro = await this.countDocuments({ isPro: true });
  const pendingPro = await this.countDocuments({ proStatus: "pending" });
  const suspendedPro = await this.countDocuments({ proStatus: "suspended" });

  const byPartnershipType = await this.aggregate([
    { $match: { isPro: true } },
    { $group: { _id: "$proInfo.partnershipType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    totalUsers,
    totalPro,
    pendingPro,
    suspendedPro,
    byPartnershipType,
  };
};

const User = mongoose.model("User", userSchema);

export default User;