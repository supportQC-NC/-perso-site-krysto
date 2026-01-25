import mongoose from "mongoose";

// ==========================================
// SCHEMA DES CATEGORIES DE VEILLE
// ==========================================
const veilleCategorySchema = new mongoose.Schema(
  {
    // Nom de la catégorie
    name: {
      type: String,
      required: [true, "Le nom de la catégorie est requis"],
      unique: true,
      trim: true,
    },
    // Description de la catégorie
    description: {
      type: String,
      default: "",
    },
    // Couleur pour l'affichage (format hex)
    color: {
      type: String,
      default: "#3B82F6",
    },
    // Icône (nom de l'icône, ex: "lightbulb", "book", "video")
    icon: {
      type: String,
      default: "folder",
    },
    // Ordre d'affichage
    displayOrder: {
      type: Number,
      default: 0,
    },
    // Statut actif/inactif
    isActive: {
      type: Boolean,
      default: true,
    },
    // Slug pour l'URL
    slug: {
      type: String,
      unique: true,
      lowercase: true,
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
veilleCategorySchema.index({ name: "text" });
veilleCategorySchema.index({ slug: 1 });
veilleCategorySchema.index({ isActive: 1 });
veilleCategorySchema.index({ displayOrder: 1 });

// ==========================================
// VIRTUAL - Nombre de veilles dans cette catégorie
// ==========================================
veilleCategorySchema.virtual("veilleCount", {
  ref: "Veille",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================
veilleCategorySchema.pre("save", function () {
  // Générer le slug à partir du nom
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// ==========================================
// MÉTHODE STATIQUE - Obtenir les catégories avec le nombre de veilles
// ==========================================
veilleCategorySchema.statics.getCategoriesWithCount = async function () {
  return this.aggregate([
    {
      $lookup: {
        from: "veilles",
        localField: "_id",
        foreignField: "category",
        as: "veilles",
      },
    },
    {
      $addFields: {
        veilleCount: { $size: "$veilles" },
      },
    },
    {
      $project: {
        veilles: 0,
      },
    },
    {
      $sort: { displayOrder: 1, name: 1 },
    },
  ]);
};

const VeilleCategory = mongoose.model("VeilleCategory", veilleCategorySchema);

export default VeilleCategory;