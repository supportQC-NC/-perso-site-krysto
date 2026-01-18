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
      required: [true, "Le type de template est obligatoire"],
      enum: {
        values: [
          "promo",
          "nouveautes",
          "destockage",
          "evenement",
          "newsletter",
          "custom",
        ],
        message: "{VALUE} n'est pas un type de template valide",
      },
    },
    content: {
      // Contenu principal de l'email
      headline: {
        type: String,
        default: "",
      },
      body: {
        type: String,
        required: [true, "Le contenu de l'email est obligatoire"],
      },
      ctaText: {
        type: String,
        default: "Découvrir",
      },
      ctaUrl: {
        type: String,
        default: "",
      },
      // Spécifique aux promos
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
      // Image optionnelle
      imageUrl: {
        type: String,
        default: "",
      },
    },
    recipients: {
      type: String,
      required: true,
      enum: {
        values: ["all", "users", "prospects", "newsletter_subscribers"],
        message: "{VALUE} n'est pas un type de destinataire valide",
      },
      default: "all",
    },
    // Filtres optionnels pour cibler
    filters: {
      // Pour les users
      isAdmin: {
        type: Boolean,
        default: null,
      },
      newsletterSubscribed: {
        type: Boolean,
        default: null,
      },
      // Pour les prospects
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
    // Historique des erreurs
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

// Index pour améliorer les performances
mailingCampaignSchema.index({ status: 1, createdAt: -1 });
mailingCampaignSchema.index({ template: 1 });
mailingCampaignSchema.index({ scheduledAt: 1 });

// Virtual pour le taux d'ouverture
mailingCampaignSchema.virtual("openRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.opened / this.stats.sent) * 100).toFixed(1);
});

// Virtual pour le taux de clic
mailingCampaignSchema.virtual("clickRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.clicked / this.stats.sent) * 100).toFixed(1);
});

// Méthode statique pour obtenir les statistiques globales
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