import mongoose from "mongoose";

const newsletterCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la campagne est obligatoire"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Le sujet de l'email est obligatoire"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["promo", "nouveautes", "destockage", "evenement", "newsletter", "custom"],
      default: "newsletter",
    },
    content: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        default: "",
      },
      body: {
        type: String,
        required: true,
      },
      ctaText: {
        type: String,
        default: "Découvrir",
      },
      ctaUrl: {
        type: String,
        default: "",
      },
      image: {
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
    },
    recipients: {
      type: String,
      enum: ["all", "prospects", "users", "newsletter_users"],
      default: "all",
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    failedEmails: [
      {
        email: String,
        error: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
newsletterCampaignSchema.index({ status: 1, createdAt: -1 });
newsletterCampaignSchema.index({ type: 1 });
newsletterCampaignSchema.index({ scheduledAt: 1 });

// Virtual pour le taux d'ouverture
newsletterCampaignSchema.virtual("openRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.opened / this.stats.sent) * 100).toFixed(1);
});

// Virtual pour le taux de clic
newsletterCampaignSchema.virtual("clickRate").get(function () {
  if (this.stats.sent === 0) return 0;
  return ((this.stats.clicked / this.stats.sent) * 100).toFixed(1);
});

// Méthode statique pour les stats globales
newsletterCampaignSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const draft = await this.countDocuments({ status: "draft" });
  const sent = await this.countDocuments({ status: "sent" });
  const scheduled = await this.countDocuments({ status: "scheduled" });

  const byType = await this.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Total emails envoyés
  const emailStats = await this.aggregate([
    { $match: { status: "sent" } },
    {
      $group: {
        _id: null,
        totalSent: { $sum: "$stats.sent" },
        totalOpened: { $sum: "$stats.opened" },
        totalClicked: { $sum: "$stats.clicked" },
      },
    },
  ]);

  return {
    total,
    draft,
    sent,
    scheduled,
    byType,
    emailStats: emailStats[0] || { totalSent: 0, totalOpened: 0, totalClicked: 0 },
  };
};

const NewsletterCampaign = mongoose.model("NewsletterCampaign", newsletterCampaignSchema);

export default NewsletterCampaign;
