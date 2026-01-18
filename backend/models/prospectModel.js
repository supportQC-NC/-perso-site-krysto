import mongoose from "mongoose";

const prospectSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir un email valide",
      ],
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced", "converted"],
      default: "active",
    },
    source: {
      type: String,
      enum: ["landing_page", "footer", "popup", "checkout", "import", "manual"],
      default: "landing_page",
    },
    tags: {
      type: [String],
      default: [],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    convertedAt: {
      type: Date,
      default: null,
    },
    convertedToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour améliorer les performances
prospectSchema.index({ email: 1 });
prospectSchema.index({ status: 1 });
prospectSchema.index({ source: 1 });
prospectSchema.index({ subscribedAt: -1 });
prospectSchema.index({ status: 1, subscribedAt: -1 });

// Méthode pour désabonner
prospectSchema.methods.unsubscribe = function () {
  this.status = "unsubscribed";
  this.unsubscribedAt = new Date();
  return this.save();
};

// Méthode pour marquer comme converti
prospectSchema.methods.markAsConverted = function (userId) {
  this.status = "converted";
  this.convertedAt = new Date();
  this.convertedToUser = userId;
  return this.save();
};

// Méthode statique pour obtenir les statistiques
prospectSchema.statics.getStats = async function () {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ status: "active" });
  const unsubscribed = await this.countDocuments({ status: "unsubscribed" });
  const bounced = await this.countDocuments({ status: "bounced" });
  const converted = await this.countDocuments({ status: "converted" });

  const bySource = await this.aggregate([
    {
      $group: {
        _id: "$source",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Inscriptions des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSubscriptions = await this.countDocuments({
    subscribedAt: { $gte: thirtyDaysAgo },
  });

  return {
    total,
    active,
    unsubscribed,
    bounced,
    converted,
    bySource,
    recentSubscriptions,
  };
};

const Prospect = mongoose.model("Prospect", prospectSchema);

export default Prospect;
