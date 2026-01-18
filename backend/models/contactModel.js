import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez fournir un email valide',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est obligatoire'],
      enum: {
        values: ['information', 'commande', 'partenariat', 'presse', 'autre'],
        message: 'Sujet invalide',
      },
    },
    message: {
      type: String,
      required: [true, 'Le message est obligatoire'],
      trim: true,
      maxlength: [1000, 'Le message ne peut pas dépasser 1000 caractères'],
    },
    status: {
      type: String,
      enum: ['nouveau', 'lu', 'en_cours', 'traite', 'archive'],
      default: 'nouveau',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    response: {
      content: {
        type: String,
        default: '',
      },
      respondedAt: {
        type: Date,
        default: null,
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour améliorer les performances des requêtes
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ subject: 1 });
contactSchema.index({ isRead: 1 });

// Virtual pour obtenir le label du sujet
contactSchema.virtual('subjectLabel').get(function () {
  const labels = {
    information: "Demande d'information",
    commande: 'Question sur une commande',
    partenariat: 'Proposition de partenariat',
    presse: 'Contact presse',
    autre: 'Autre',
  };
  return labels[this.subject] || this.subject;
});

// Méthode pour marquer comme lu
contactSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  if (this.status === 'nouveau') {
    this.status = 'lu';
  }
  return this.save();
};

// Méthode pour ajouter une réponse
contactSchema.methods.addResponse = function (content, userId) {
  this.response = {
    content,
    respondedAt: new Date(),
    respondedBy: userId,
  };
  this.status = 'traite';
  return this.save();
};

// Méthode statique pour obtenir les statistiques
contactSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const subjectStats = await this.aggregate([
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    byStatus: stats,
    bySubject: subjectStats,
    total: await this.countDocuments(),
    unread: await this.countDocuments({ isRead: false }),
  };
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;