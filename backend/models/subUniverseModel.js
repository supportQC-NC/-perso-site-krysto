import mongoose from "mongoose";

const subUniverseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du sous-univers est requis"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    image: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    universe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Universe",
      required: [true, "L'univers parent est requis"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour améliorer les performances
subUniverseSchema.index({ slug: 1 });
subUniverseSchema.index({ universe: 1 });
subUniverseSchema.index({ universe: 1, isActive: 1, displayOrder: 1 });

// Index unique composé : un nom unique par univers
subUniverseSchema.index({ name: 1, universe: 1 }, { unique: true });

// Virtual pour compter les produits dans ce sous-univers
subUniverseSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "subUniverse",
  count: true,
});

// Middleware pre-save pour générer le slug
subUniverseSchema.pre("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Méthode statique pour vérifier si un sous-univers peut être supprimé
subUniverseSchema.statics.canDelete = async function (subUniverseId) {
  const Product = mongoose.model("Product");
  const productCount = await Product.countDocuments({ subUniverse: subUniverseId });
  return productCount === 0;
};

const SubUniverse = mongoose.model("SubUniverse", subUniverseSchema);

export default SubUniverse;
