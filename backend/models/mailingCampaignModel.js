import mongoose from "mongoose";

const mailingCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la campagne est obligatoire"],
      trim: true,
      maxlength: [200, "Le nom ne peut pas dépasser 200 caractères"],
    },
    subject: {
      type: String,
      required: [true, "Le sujet de l'email est obligatoire"],
      trim: true,
      maxlength: [200, "Le sujet ne peut pas dépasser 200 caractères"],
    },
    template: {
      type: String,
      enum: {
        values: [
          "promo",
          "nouveautes",
          "destockage",
          "evenement",
          "newsletter",
          "custom",
          "blocks", // NOUVEAU: pour les campagnes créées avec l'éditeur de blocs
        ],
        message: "{VALUE} n'est pas un type de template valide",
      },
      default: "newsletter",
    },
    
    // ==========================================
    // ANCIEN SYSTÈME: Contenu simple
    // ==========================================
    content: {
      headline: {
        type: String,
        default: "",
      },
      body: {
        type: String,
        default: "", // Plus required car on peut utiliser les blocs
      },
      ctaText: {
        type: String,
        default: "Découvrir",
      },
      ctaUrl: {
        type: String,
        default: "",
      },
      promoCode: {
        type: String,
        default: "",
      },
      promoDiscount: {
        type: String,
        default: "",
      },
      promoExpiry: {
        type: Date,
        default: null,
      },
      imageUrl: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // NOUVEAU SYSTÈME: Éditeur de blocs
    // ==========================================
    blocks: {
      type: Array,
      default: [],
    },
    settings: {
      type: Object,
      default: {
        maxWidth: 600,
        backgroundColor: "#f4f4f4",
        contentBackgroundColor: "#ffffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        baseFontSize: 16,
        baseTextColor: "#333333",
        borderRadius: 16,
        contentPadding: 0,
        preheaderText: "",
        mobileOptimized: true,
      },
    },

    // ==========================================
    // DESTINATAIRES
    // ==========================================
    recipients: {
      type: String,
      required: true,
      enum: {
        values: ["all", "users", "prospects", "newsletter_subscribers"],
        message: "{VALUE} n'est pas un type de destinataire valide",
      },
      default: "all",
    },
    filters: {
      isAdmin: {
        type: Boolean,
        default: null,
      },
      newsletterSubscribed: {
        type: Boolean,
        default: null,
      },
      prospectStatus: {
        type: String,
        enum: ["active", "unsubscribed", "bounced", "converted", null],
        default: null,
      },
      prospectSource: {
        type: String,
        default: null,
      },
      prospectTags: {
        type: [String],
        default: [],
      },
    },

    // ==========================================
    // STATUT ET PLANIFICATION
    // ==========================================
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed", "cancelled"],
      default: "draft",
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // STATISTIQUES
    // ==========================================
    stats: {
      totalRecipients: {
        type: Number,
        default: 0,
      },
      sent: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
      opened: {
        type: Number,
        default: 0,
      },
      clicked: {
        type: Number,
        default: 0,
      },
    },
    errors: [
      {
        email: String,
        error: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
mailingCampaignSchema.index({ status: 1, createdAt: -1 });
mailingCampaignSchema.index({ template: 1 });
mailingCampaignSchema.index({ scheduledAt: 1 });

// Virtual: Taux d'ouverture
mailingCampaignSchema.virtual("openRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.opened / this.stats.sent) * 100).toFixed(1);
});

// Virtual: Taux de clic
mailingCampaignSchema.virtual("clickRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.clicked / this.stats.sent) * 100).toFixed(1);
});

// Virtual: Vérifie si la campagne utilise les blocs
mailingCampaignSchema.virtual("usesBlocks").get(function () {
  return this.blocks && this.blocks.length > 0;
});

// Virtual: Vérifie si la campagne a du contenu
mailingCampaignSchema.virtual("hasContent").get(function () {
  const hasBlocks = this.blocks && this.blocks.length > 0;
  const hasBody = this.content && this.content.body;
  return hasBlocks || hasBody;
});

// Méthode statique: Statistiques globales
mailingCampaignSchema.statics.getGlobalStats = async function () {
  const totalCampaigns = await this.countDocuments();
  const sentCampaigns = await this.countDocuments({ status: "sent" });
  const draftCampaigns = await this.countDocuments({ status: "draft" });
  const scheduledCampaigns = await this.countDocuments({ status: "scheduled" });

  const aggregateStats = await this.aggregate([
    { $match: { status: "sent" } },
    {
      $group: {
        _id: null,
        totalSent: { $sum: "$stats.sent" },
        totalFailed: { $sum: "$stats.failed" },
        totalOpened: { $sum: "$stats.opened" },
        totalClicked: { $sum: "$stats.clicked" },
      },
    },
  ]);

  const stats = aggregateStats[0] || {
    totalSent: 0,
    totalFailed: 0,
    totalOpened: 0,
    totalClicked: 0,
  };

  return {
    totalCampaigns,
    sentCampaigns,
    draftCampaigns,
    scheduledCampaigns,
    ...stats,
    averageOpenRate:
      stats.totalSent > 0
        ? ((stats.totalOpened / stats.totalSent) * 100).toFixed(1)
        : 0,
    averageClickRate:
      stats.totalSent > 0
        ? ((stats.totalClicked / stats.totalSent) * 100).toFixed(1)
        : 0,
  };
};

const MailingCampaign = mongoose.model("MailingCampaign", mailingCampaignSchema);

export default MailingCampaign;