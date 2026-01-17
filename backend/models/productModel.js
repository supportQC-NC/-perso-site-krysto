import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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

    // ==========================================
    // CATÉGORIE & TYPE DE PRODUIT
    // ==========================================
    category: {
      type: String,
      required: [true, "La catégorie est requise"],
      enum: {
        values: [
          "Maison",
          "Salle de bain",
          "Accessoires",
          "Jeux",
          "Bureau",
          "Bijoux",
          "Coffrets",
        ],
        message: "{VALUE} n'est pas une catégorie valide",
      },
    },
    productType: {
      type: String,
      required: [true, "Le type de produit est requis"],
      enum: {
        values: [
          // Maison
          "Cache-pot",
          "Sous-verre",
          "Dessous de plat",
          "Vase",
          // Salle de bain
          "Peigne",
          "Porte-savon",
          "Gobelet",
          "Pack Salle de bain",
          // Accessoires
          "Lunettes",
          "Porte-clés",
          "Coque téléphone",
          // Jeux
          "Jeu de société",
          "Jouet",
          // Bureau
          "Stylo",
          "Pot à crayons",
          "Règle",
          // Bijoux
          "Bague",
          "Bracelet",
          "Collier",
          "Boucles d'oreilles",
          // Coffrets
          "Coffret cadeau",
          // Autre
          "Autre",
        ],
        message: "{VALUE} n'est pas un type de produit valide",
      },
    },

    // ==========================================
    // PRIX & STOCK
    // ==========================================
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

    // ==========================================
    // AVIS & NOTES
    // ==========================================
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

    // ==========================================
    // INFORMATIONS COMPLÉMENTAIRES
    // ==========================================
    careInstructions: {
      type: String,
      default: "",
    },

    // ==========================================
    // STATUTS & FLAGS
    // ==========================================
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
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },

    // ==========================================
    // SEO
    // ==========================================
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
productSchema.index({ productType: 1 });
productSchema.index({ category: 1, productType: 1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });

// ==========================================
// VIRTUALS
// ==========================================
productSchema.virtual("formattedPrice").get(function () {
  return `${this.price.toLocaleString("fr-FR")} XPF`;
});

productSchema.virtual("currentPrice").get(function () {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price;
});

// ==========================================
// MIDDLEWARE
// ==========================================

// Générer le slug automatiquement avant la sauvegarde
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-z0-9]+/g, "-") // Remplace les caractères spéciaux par des tirets
      .replace(/(^-|-$)/g, ""); // Supprime les tirets en début/fin
  }
  next();
});

// Mettre à jour isOnSale si salePrice est défini
productSchema.pre("save", function (next) {
  if (this.salePrice && this.salePrice < this.price) {
    this.isOnSale = true;
  } else {
    this.isOnSale = false;
    this.salePrice = null;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;