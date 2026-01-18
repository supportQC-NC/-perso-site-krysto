import mongoose from "mongoose";

const universeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'univers est requis"],
      unique: true,
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
      required: [true, "L'image de l'univers est requise"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
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
universeSchema.index({ slug: 1 });
universeSchema.index({ isActive: 1, displayOrder: 1 });

// Virtual pour compter les produits dans cet univers
universeSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "universe",
  count: true,
});

// Middleware pre-save pour générer le slug
universeSchema.pre("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Méthode statique pour vérifier si un univers peut être supprimé
universeSchema.statics.canDelete = async function (universeId) {
  const Product = mongoose.model("Product");
  const productCount = await Product.countDocuments({ universe: universeId });
  return productCount === 0;
};

const Universe = mongoose.model("Universe", universeSchema);

export default Universe;