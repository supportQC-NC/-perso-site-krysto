import mongoose from "mongoose";

// ==========================================
// SCHEMA DES AVIS
// ==========================================
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// SCHEMA DU PRODUIT
// ==========================================
const productSchema = new mongoose.Schema(
  {
    // Référence à l'utilisateur qui a créé le produit
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Référence à l'univers du produit
    universe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
      default: null,
    },
    // Référence au sous-univers du produit
    subUniverse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubUniverse",
      default: null,
    },
    name: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
    },
    description_fr: {
      type: String,
      required: [true, "La description est requise"],
    },
    image: {
      type: String,
      required: [true, "L'image du produit est requise"],
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      required: [true, "La marque est requise"],
      trim: true,
      default: "Krysto",
    },
    color: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
    },
    plasticType: {
      type: String,
      required: [true, "Le type de plastique est requis"],
      enum: {
        values: ["HDPE", "PET", "PP", "LDPE", "PVC", "PS", "HDPE/PP", "Autre"],
        message: "{VALUE} n'est pas un type de plastique valide",
      },
    },
    plasticOrigin: {
      type: String,
      required: [true, "L'origine du plastique est requise"],
    },
    // Catégorie du produit
    category: {
      type: String,
      required: [true, "La catégorie est requise"],
      enum: {
        values: [
          "Maison & Déco",
          "Bazar",
          "Jeux",
          "Bureautique",
          "Bijoux",
          "Mode & beauté",
          "",
        ],
        message: "{VALUE} n'est pas une catégorie valide",
      },
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    salePrice: {
      type: Number,
      min: [0, "Le prix promo ne peut pas être négatif"],
      default: null,
    },
    countInStock: {
      type: Number,
      required: true,
      min: [0, "Le stock ne peut pas être négatif"],
      default: 0,
    },
    // Avis des clients
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
      min: [0, "La note minimale est 0"],
      max: [5, "La note maximale est 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    careInstructions: {
      type: String,
      default: "",
    },
    // Flags de statut produit
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    // NOUVEAU: Produit en déstockage
    isDestockage: {
      type: Boolean,
      default: false,
    },
    // NOUVEAU: Produit bientôt disponible (annoncé mais pas encore en stock)
    isComingSoon: {
      type: Boolean,
      default: false,
    },
    // Date de disponibilité prévue (optionnel, pour isComingSoon)
    availableDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEX
// ==========================================
productSchema.index({ name: "text", description_fr: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });
// Index pour l'univers
productSchema.index({ universe: 1 });
productSchema.index({ universe: 1, status: 1 });
// Index pour le sous-univers
productSchema.index({ subUniverse: 1 });
productSchema.index({ subUniverse: 1, status: 1 });
productSchema.index({ universe: 1, subUniverse: 1, status: 1 });
// Index pour les nouveaux flags
productSchema.index({ isDestockage: 1 });
productSchema.index({ isComingSoon: 1 });
productSchema.index({ isDestockage: 1, status: 1 });
productSchema.index({ isComingSoon: 1, status: 1 });

// ==========================================
// VIRTUALS
// ==========================================
productSchema.virtual("formattedPrice").get(function () {
  return `${this.price.toLocaleString("fr-FR")} XPF`;
});

productSchema.virtual("currentPrice").get(function () {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price;
});

// Virtual pour vérifier si le produit est disponible à l'achat
productSchema.virtual("isAvailable").get(function () {
  return (
    this.status === "active" &&
    !this.isComingSoon &&
    this.countInStock > 0
  );
});

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================
productSchema.pre("save", function () {
  // Générer le slug
  if (this.isModified("name") || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ajouter timestamp pour unicité
    this.slug = `${baseSlug}-${Date.now()}`;
  }

  // Gérer isOnSale
  if (this.salePrice && this.salePrice < this.price) {
    this.isOnSale = true;
  } else {
    this.isOnSale = false;
    this.salePrice = null;
  }

  // Si le produit est "coming soon", il ne devrait pas être en destockage
  if (this.isComingSoon) {
    this.isDestockage = false;
  }

  // Si pas de date de disponibilité et plus en coming soon, reset
  if (!this.isComingSoon) {
    this.availableDate = null;
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;