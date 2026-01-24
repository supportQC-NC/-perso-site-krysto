import mongoose from "mongoose";

// ==========================================
// SCHÉMA DES BLOCS DE CONTENU
// ==========================================

// Schéma pour les styles communs à tous les blocs
const blockStyleSchema = new mongoose.Schema(
  {
    backgroundColor: { type: String, default: "transparent" },
    paddingTop: { type: Number, default: 20 },
    paddingBottom: { type: Number, default: 20 },
    paddingLeft: { type: Number, default: 20 },
    paddingRight: { type: Number, default: 20 },
    marginTop: { type: Number, default: 0 },
    marginBottom: { type: Number, default: 0 },
    borderRadius: { type: Number, default: 0 },
    borderWidth: { type: Number, default: 0 },
    borderColor: { type: String, default: "#e0e0e0" },
    borderStyle: { type: String, default: "solid" },
  },
  { _id: false }
);

// Schéma pour le bloc Header
const headerBlockDataSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: "" },
    logoWidth: { type: Number, default: 150 },
    logoAlt: { type: String, default: "Logo" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
    backgroundColor: { type: String, default: "#2d6a4f" },
    titleColor: { type: String, default: "#ffffff" },
    subtitleColor: { type: String, default: "#e0e0e0" },
    titleFontSize: { type: Number, default: 28 },
    subtitleFontSize: { type: Number, default: 16 },
    showIcon: { type: Boolean, default: false },
    icon: { type: String, default: "📬" },
  },
  { _id: false }
);

// Schéma pour le bloc Text
const textBlockDataSchema = new mongoose.Schema(
  {
    content: { type: String, default: "<p>Votre texte ici...</p>" },
    alignment: { type: String, enum: ["left", "center", "right", "justify"], default: "left" },
    textColor: { type: String, default: "#333333" },
    fontSize: { type: Number, default: 16 },
    lineHeight: { type: Number, default: 1.6 },
    fontWeight: { type: String, enum: ["normal", "bold"], default: "normal" },
  },
  { _id: false }
);

// Schéma pour le bloc Image
const imageBlockDataSchema = new mongoose.Schema(
  {
    src: { type: String, default: "" },
    alt: { type: String, default: "Image" },
    width: { type: String, default: "100%" },
    maxWidth: { type: Number, default: 600 },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
    linkUrl: { type: String, default: "" },
    borderRadius: { type: Number, default: 8 },
    caption: { type: String, default: "" },
    captionColor: { type: String, default: "#666666" },
  },
  { _id: false }
);

// Schéma pour le bloc Button (CTA)
const buttonBlockDataSchema = new mongoose.Schema(
  {
    text: { type: String, default: "Cliquez ici" },
    url: { type: String, default: "#" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
    backgroundColor: { type: String, default: "#2d6a4f" },
    textColor: { type: String, default: "#ffffff" },
    fontSize: { type: Number, default: 16 },
    fontWeight: { type: String, enum: ["normal", "bold"], default: "bold" },
    paddingVertical: { type: Number, default: 14 },
    paddingHorizontal: { type: Number, default: 32 },
    borderRadius: { type: Number, default: 25 },
    fullWidth: { type: Boolean, default: false },
    icon: { type: String, default: "" },
    iconPosition: { type: String, enum: ["left", "right"], default: "right" },
  },
  { _id: false }
);

// Schéma pour le bloc Divider
const dividerBlockDataSchema = new mongoose.Schema(
  {
    style: { type: String, enum: ["solid", "dashed", "dotted"], default: "solid" },
    color: { type: String, default: "#e0e0e0" },
    thickness: { type: Number, default: 1 },
    width: { type: String, default: "100%" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
  },
  { _id: false }
);

// Schéma pour le bloc Spacer
const spacerBlockDataSchema = new mongoose.Schema(
  {
    height: { type: Number, default: 30 },
  },
  { _id: false }
);

// Schéma pour le bloc Social
const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok", "whatsapp", "email", "website"],
      required: true,
    },
    url: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const socialBlockDataSchema = new mongoose.Schema(
  {
    links: { type: [socialLinkSchema], default: [] },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
    iconSize: { type: Number, default: 32 },
    iconStyle: { type: String, enum: ["colored", "mono-dark", "mono-light"], default: "colored" },
    spacing: { type: Number, default: 10 },
  },
  { _id: false }
);

// Schéma pour le bloc Promo Code
const promoCodeBlockDataSchema = new mongoose.Schema(
  {
    code: { type: String, default: "CODE10" },
    description: { type: String, default: "Votre code promo exclusif" },
    discount: { type: String, default: "-10%" },
    expiryDate: { type: Date, default: null },
    showExpiry: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#fff8e1" },
    borderColor: { type: String, default: "#ffc107" },
    codeColor: { type: String, default: "#e53935" },
    textColor: { type: String, default: "#333333" },
  },
  { _id: false }
);

// Schéma pour le bloc Product Card
const productCardBlockDataSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    imageUrl: { type: String, default: "" },
    name: { type: String, default: "Nom du produit" },
    description: { type: String, default: "" },
    price: { type: String, default: "" },
    oldPrice: { type: String, default: "" },
    buttonText: { type: String, default: "Voir le produit" },
    buttonUrl: { type: String, default: "#" },
    showPrice: { type: Boolean, default: true },
    showButton: { type: Boolean, default: true },
    layout: { type: String, enum: ["vertical", "horizontal"], default: "vertical" },
    imageWidth: { type: String, default: "100%" },
    backgroundColor: { type: String, default: "#ffffff" },
    borderColor: { type: String, default: "#e0e0e0" },
  },
  { _id: false }
);

// Schéma pour le bloc Columns (2 ou 3 colonnes)
const columnContentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["text", "image", "button"], default: "text" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const columnsBlockDataSchema = new mongoose.Schema(
  {
    columnCount: { type: Number, enum: [2, 3], default: 2 },
    gap: { type: Number, default: 20 },
    columns: {
      type: [columnContentSchema],
      default: [
        { type: "text", data: { content: "Colonne 1" } },
        { type: "text", data: { content: "Colonne 2" } },
      ],
    },
    verticalAlignment: { type: String, enum: ["top", "middle", "bottom"], default: "top" },
  },
  { _id: false }
);

// Schéma pour le bloc Footer
const footerBlockDataSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Krysto" },
    companyAddress: { type: String, default: "Nouvelle-Calédonie 🇳🇨" },
    showUnsubscribe: { type: Boolean, default: true },
    unsubscribeText: { type: String, default: "Se désinscrire de la newsletter" },
    customLinks: {
      type: [
        {
          label: { type: String },
          url: { type: String },
        },
      ],
      default: [],
    },
    showSocialLinks: { type: Boolean, default: false },
    socialLinks: { type: [socialLinkSchema], default: [] },
    backgroundColor: { type: String, default: "#f5f5f5" },
    textColor: { type: String, default: "#888888" },
    linkColor: { type: String, default: "#2d6a4f" },
    alignment: { type: String, enum: ["left", "center", "right"], default: "center" },
    copyright: { type: String, default: "" },
  },
  { _id: false }
);

// Schéma pour le bloc HTML personnalisé
const htmlBlockDataSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
  },
  { _id: false }
);

// ==========================================
// SCHÉMA PRINCIPAL DU BLOC
// ==========================================

const blockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "header",
        "text",
        "image",
        "button",
        "divider",
        "spacer",
        "social",
        "promo-code",
        "product-card",
        "columns",
        "footer",
        "html",
      ],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    styles: {
      type: blockStyleSchema,
      default: () => ({}),
    },
    locked: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// ==========================================
// SCHÉMA DES SETTINGS GLOBAUX DU TEMPLATE
// ==========================================

const templateSettingsSchema = new mongoose.Schema(
  {
    // Largeur et fond
    maxWidth: { type: Number, default: 600 },
    backgroundColor: { type: String, default: "#f4f4f4" },
    contentBackgroundColor: { type: String, default: "#ffffff" },

    // Typographie globale
    fontFamily: {
      type: String,
      default: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    baseFontSize: { type: Number, default: 16 },
    baseTextColor: { type: String, default: "#333333" },
    baseLinkColor: { type: String, default: "#2d6a4f" },

    // Couleurs de la marque
    primaryColor: { type: String, default: "#2d6a4f" },
    secondaryColor: { type: String, default: "#40916c" },
    accentColor: { type: String, default: "#ffc107" },

    // Padding global du contenu
    contentPadding: { type: Number, default: 20 },

    // Border radius global
    borderRadius: { type: Number, default: 16 },

    // Preheader (texte affiché dans la prévisualisation email)
    preheaderText: { type: String, default: "" },

    // Responsive
    mobileOptimized: { type: Boolean, default: true },
  },
  { _id: false }
);

// ==========================================
// SCHÉMA PRINCIPAL DU TEMPLATE
// ==========================================

const mailingTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du template est obligatoire"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
      default: "",
    },
    category: {
      type: String,
      enum: [
        "promo",
        "newsletter",
        "evenement",
        "nouveautes",
        "destockage",
        "bienvenue",
        "relance",
        "transactionnel",
        "custom",
      ],
      default: "custom",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // Structure des blocs
    blocks: {
      type: [blockSchema],
      default: [],
    },
    // Settings globaux
    settings: {
      type: templateSettingsSchema,
      default: () => ({}),
    },
    // Métadonnées
    isDefault: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Créateur
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

mailingTemplateSchema.index({ name: "text", description: "text", tags: "text" });
mailingTemplateSchema.index({ category: 1 });
mailingTemplateSchema.index({ isDefault: 1 });
mailingTemplateSchema.index({ isPublic: 1 });
mailingTemplateSchema.index({ createdBy: 1 });
mailingTemplateSchema.index({ usageCount: -1 });

// ==========================================
// MÉTHODES STATIQUES
// ==========================================

// Récupérer les templates par défaut (système)
mailingTemplateSchema.statics.getDefaultTemplates = function () {
  return this.find({ isDefault: true }).sort({ category: 1, name: 1 });
};

// Récupérer les templates d'un utilisateur
mailingTemplateSchema.statics.getUserTemplates = function (userId) {
  return this.find({ createdBy: userId, isDefault: false }).sort({ updatedAt: -1 });
};

// Récupérer les templates publics
mailingTemplateSchema.statics.getPublicTemplates = function () {
  return this.find({ isPublic: true, isDefault: false }).sort({ usageCount: -1 });
};

// Incrémenter le compteur d'utilisation
mailingTemplateSchema.statics.incrementUsage = async function (templateId) {
  return this.findByIdAndUpdate(templateId, { $inc: { usageCount: 1 } }, { new: true });
};

// Dupliquer un template
mailingTemplateSchema.methods.duplicate = function (userId, newName) {
  const duplicated = this.toObject();
  delete duplicated._id;
  delete duplicated.id;
  duplicated.name = newName || `${this.name} (copie)`;
  duplicated.isDefault = false;
  duplicated.isPublic = false;
  duplicated.usageCount = 0;
  duplicated.createdBy = userId;
  duplicated.createdAt = undefined;
  duplicated.updatedAt = undefined;

  return new this.constructor(duplicated);
};

// ==========================================
// CONSTANTES EXPORTÉES
// ==========================================

export const BLOCK_TYPES = {
  HEADER: "header",
  TEXT: "text",
  IMAGE: "image",
  BUTTON: "button",
  DIVIDER: "divider",
  SPACER: "spacer",
  SOCIAL: "social",
  PROMO_CODE: "promo-code",
  PRODUCT_CARD: "product-card",
  COLUMNS: "columns",
  FOOTER: "footer",
  HTML: "html",
};

export const BLOCK_LABELS = {
  header: { label: "En-tête", icon: "📋", description: "Logo, titre et sous-titre" },
  text: { label: "Texte", icon: "📝", description: "Paragraphe de texte formaté" },
  image: { label: "Image", icon: "🖼️", description: "Image avec lien optionnel" },
  button: { label: "Bouton", icon: "🔘", description: "Bouton d'appel à l'action" },
  divider: { label: "Séparateur", icon: "➖", description: "Ligne de séparation" },
  spacer: { label: "Espace", icon: "↕️", description: "Espace vide vertical" },
  social: { label: "Réseaux sociaux", icon: "🌐", description: "Liens vers les réseaux sociaux" },
  "promo-code": { label: "Code promo", icon: "🏷️", description: "Affichage d'un code promotionnel" },
  "product-card": { label: "Carte produit", icon: "🛍️", description: "Présentation d'un produit" },
  columns: { label: "Colonnes", icon: "▤", description: "Mise en page en colonnes" },
  footer: { label: "Pied de page", icon: "📄", description: "Informations légales et liens" },
  html: { label: "HTML", icon: "💻", description: "Code HTML personnalisé" },
};

export const TEMPLATE_CATEGORIES = {
  promo: { label: "Promotion", icon: "🏷️", color: "#e53935" },
  newsletter: { label: "Newsletter", icon: "📬", color: "#1976d2" },
  evenement: { label: "Événement", icon: "🎉", color: "#7b1fa2" },
  nouveautes: { label: "Nouveautés", icon: "✨", color: "#2d6a4f" },
  destockage: { label: "Déstockage", icon: "🔥", color: "#f57c00" },
  bienvenue: { label: "Bienvenue", icon: "👋", color: "#00897b" },
  relance: { label: "Relance", icon: "🔔", color: "#5c6bc0" },
  transactionnel: { label: "Transactionnel", icon: "📦", color: "#78909c" },
  custom: { label: "Personnalisé", icon: "💼", color: "#455a64" },
};

export const SOCIAL_PLATFORMS = {
  facebook: { label: "Facebook", icon: "facebook", color: "#1877f2" },
  instagram: { label: "Instagram", icon: "instagram", color: "#e4405f" },
  twitter: { label: "Twitter/X", icon: "twitter", color: "#000000" },
  linkedin: { label: "LinkedIn", icon: "linkedin", color: "#0a66c2" },
  youtube: { label: "YouTube", icon: "youtube", color: "#ff0000" },
  tiktok: { label: "TikTok", icon: "tiktok", color: "#000000" },
  whatsapp: { label: "WhatsApp", icon: "whatsapp", color: "#25d366" },
  email: { label: "Email", icon: "mail", color: "#666666" },
  website: { label: "Site web", icon: "globe", color: "#2d6a4f" },
};

// Fonction pour créer un bloc vide avec les valeurs par défaut
export const createDefaultBlock = (type) => {
  const id = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const defaultData = {
    header: {
      logoUrl: "",
      logoWidth: 150,
      title: "Titre de votre email",
      subtitle: "",
      alignment: "center",
      backgroundColor: "#2d6a4f",
      titleColor: "#ffffff",
      subtitleColor: "#e0e0e0",
      titleFontSize: 28,
      subtitleFontSize: 16,
      showIcon: false,
      icon: "📬",
    },
    text: {
      content: "<p>Votre texte ici...</p>",
      alignment: "left",
      textColor: "#333333",
      fontSize: 16,
      lineHeight: 1.6,
      fontWeight: "normal",
    },
    image: {
      src: "",
      alt: "Image",
      width: "100%",
      maxWidth: 600,
      alignment: "center",
      linkUrl: "",
      borderRadius: 8,
      caption: "",
    },
    button: {
      text: "Cliquez ici",
      url: "#",
      alignment: "center",
      backgroundColor: "#2d6a4f",
      textColor: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 25,
      fullWidth: false,
    },
    divider: {
      style: "solid",
      color: "#e0e0e0",
      thickness: 1,
      width: "100%",
      alignment: "center",
    },
    spacer: {
      height: 30,
    },
    social: {
      links: [],
      alignment: "center",
      iconSize: 32,
      iconStyle: "colored",
      spacing: 10,
    },
    "promo-code": {
      code: "CODE10",
      description: "Votre code promo exclusif",
      discount: "-10%",
      expiryDate: null,
      showExpiry: true,
      backgroundColor: "#fff8e1",
      borderColor: "#ffc107",
      codeColor: "#e53935",
    },
    "product-card": {
      productId: null,
      imageUrl: "",
      name: "Nom du produit",
      description: "",
      price: "",
      oldPrice: "",
      buttonText: "Voir le produit",
      buttonUrl: "#",
      showPrice: true,
      showButton: true,
      layout: "vertical",
    },
    columns: {
      columnCount: 2,
      gap: 20,
      columns: [
        { type: "text", data: { content: "<p>Colonne 1</p>" } },
        { type: "text", data: { content: "<p>Colonne 2</p>" } },
      ],
      verticalAlignment: "top",
    },
    footer: {
      companyName: "Krysto",
      companyAddress: "Nouvelle-Calédonie 🇳🇨",
      showUnsubscribe: true,
      unsubscribeText: "Se désinscrire de la newsletter",
      customLinks: [],
      showSocialLinks: false,
      socialLinks: [],
      backgroundColor: "#f5f5f5",
      textColor: "#888888",
      linkColor: "#2d6a4f",
      alignment: "center",
    },
    html: {
      content: "",
    },
  };

  return {
    id,
    type,
    data: defaultData[type] || {},
    styles: {
      backgroundColor: "transparent",
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "#e0e0e0",
      borderStyle: "solid",
    },
    locked: false,
    hidden: false,
  };
};

const MailingTemplate = mongoose.model("MailingTemplate", mailingTemplateSchema);

export default MailingTemplate;