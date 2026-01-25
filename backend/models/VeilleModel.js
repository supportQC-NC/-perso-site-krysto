import mongoose from "mongoose";

// ==========================================
// SCHEMA DES VEILLES
// ==========================================
const veilleSchema = new mongoose.Schema(
  {
    // Utilisateur qui a créé la veille
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // Titre de la veille
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    // Description / Notes
    description: {
      type: String,
      default: "",
    },
    // Type de contenu
    contentType: {
      type: String,
      required: [true, "Le type de contenu est requis"],
      enum: {
        values: ["link", "image", "youtube", "document"],
        message: "{VALUE} n'est pas un type de contenu valide",
      },
    },
    // URL du lien ou de la vidéo YouTube
    url: {
      type: String,
      default: null,
    },
    // URL de l'image (externe ou uploadée)
    imageUrl: {
      type: String,
      default: null,
    },
    // Image uploadée localement
    uploadedImage: {
      type: String,
      default: null,
    },
    // Miniature (pour les vidéos YouTube ou preview des liens)
    thumbnail: {
      type: String,
      default: null,
    },
    // ID de la vidéo YouTube (extrait de l'URL)
    youtubeVideoId: {
      type: String,
      default: null,
    },
    // Catégorie de la veille
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VeilleCategory",
      required: [true, "La catégorie est requise"],
    },
    // Tags pour faciliter la recherche
    tags: {
      type: [String],
      default: [],
    },
    // Source (nom du site, auteur, etc.)
    source: {
      type: String,
      default: "",
    },
    // Priorité / Importance
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // Statut de lecture/traitement
    status: {
      type: String,
      enum: ["unread", "read", "archived", "favorite"],
      default: "unread",
    },
    // Date de lecture
    readAt: {
      type: Date,
      default: null,
    },
    // Notes personnelles
    notes: {
      type: String,
      default: "",
    },
    // Favori
    isFavorite: {
      type: Boolean,
      default: false,
    },
    // Archivé
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Métadonnées extraites automatiquement
    metadata: {
      // Titre de la page (pour les liens)
      pageTitle: { type: String, default: null },
      // Description de la page
      pageDescription: { type: String, default: null },
      // Favicon du site
      favicon: { type: String, default: null },
      // Durée de la vidéo (pour YouTube)
      videoDuration: { type: String, default: null },
      // Nom de la chaîne YouTube
      channelName: { type: String, default: null },
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
veilleSchema.index({ title: "text", description: "text", tags: "text" });
veilleSchema.index({ category: 1 });
veilleSchema.index({ contentType: 1 });
veilleSchema.index({ status: 1 });
veilleSchema.index({ priority: 1 });
veilleSchema.index({ isFavorite: 1 });
veilleSchema.index({ isArchived: 1 });
veilleSchema.index({ user: 1 });
veilleSchema.index({ createdAt: -1 });
veilleSchema.index({ category: 1, status: 1 });
veilleSchema.index({ tags: 1 });
veilleSchema.index({ slug: 1 });

// ==========================================
// VIRTUALS
// ==========================================
// URL de l'image finale (uploadée ou externe)
veilleSchema.virtual("finalImageUrl").get(function () {
  return this.uploadedImage || this.imageUrl || this.thumbnail;
});

// URL embed YouTube
veilleSchema.virtual("youtubeEmbedUrl").get(function () {
  if (this.youtubeVideoId) {
    return `https://www.youtube.com/embed/${this.youtubeVideoId}`;
  }
  return null;
});

// ==========================================
// MIDDLEWARE PRE-SAVE
// ==========================================
veilleSchema.pre("save", function () {
  // Générer le slug
  if (this.isModified("title") || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ajouter timestamp pour unicité
    this.slug = `${baseSlug}-${Date.now()}`;
  }

  // Extraire l'ID YouTube si c'est une URL YouTube
  if (this.contentType === "youtube" && this.url) {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = this.url.match(youtubeRegex);
    if (match && match[1]) {
      this.youtubeVideoId = match[1];
      // Générer la miniature YouTube
      this.thumbnail = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
  }

  // Gérer le statut favori/archivé
  if (this.isFavorite && this.status !== "favorite") {
    this.status = "favorite";
  }
  if (this.isArchived && this.status !== "archived") {
    this.status = "archived";
  }

  // Marquer la date de lecture
  if (this.isModified("status") && this.status === "read" && !this.readAt) {
    this.readAt = new Date();
  }
});

// ==========================================
// MÉTHODES D'INSTANCE
// ==========================================
veilleSchema.methods.markAsRead = async function () {
  this.status = "read";
  this.readAt = new Date();
  return this.save();
};

veilleSchema.methods.toggleFavorite = async function () {
  this.isFavorite = !this.isFavorite;
  if (this.isFavorite) {
    this.status = "favorite";
    this.isArchived = false;
  } else {
    this.status = "read";
  }
  return this.save();
};

veilleSchema.methods.archive = async function () {
  this.isArchived = true;
  this.isFavorite = false;
  this.status = "archived";
  return this.save();
};

veilleSchema.methods.unarchive = async function () {
  this.isArchived = false;
  this.status = "read";
  return this.save();
};

// ==========================================
// MÉTHODES STATIQUES
// ==========================================
veilleSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        byContentType: [
          {
            $group: {
              _id: "$contentType",
              count: { $sum: 1 },
            },
          },
        ],
        byCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "veillecategories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryInfo",
            },
          },
          {
            $unwind: {
              path: "$categoryInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              count: 1,
              categoryName: "$categoryInfo.name",
              categoryColor: "$categoryInfo.color",
            },
          },
        ],
        byPriority: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],
        favorites: [
          { $match: { isFavorite: true } },
          { $count: "count" },
        ],
        archived: [
          { $match: { isArchived: true } },
          { $count: "count" },
        ],
        recentlyAdded: [
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const result = stats[0];

  return {
    total: result.total[0]?.count || 0,
    byStatus: result.byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byContentType: result.byContentType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byCategory: result.byCategory,
    byPriority: result.byPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    favorites: result.favorites[0]?.count || 0,
    archived: result.archived[0]?.count || 0,
    recentlyAdded: result.recentlyAdded[0]?.count || 0,
  };
};

const Veille = mongoose.model("Veille", veilleSchema);

export default Veille;