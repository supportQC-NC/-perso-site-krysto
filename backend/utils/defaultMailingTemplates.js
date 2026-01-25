// ==========================================
// TEMPLATES PAR DÉFAUT DU SYSTÈME
// Ces templates sont injectés en base de données lors du seed
// ==========================================

import { createDefaultBlock } from "../models/maillingTemplateModel.js";

// Helper pour générer un ID unique
const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==========================================
// TEMPLATE: NEWSLETTER CLASSIQUE
// ==========================================
export const newsletterTemplate = {
  name: "Newsletter Classique",
  description: "Template épuré pour vos newsletters régulières avec en-tête, contenu et pied de page",
  category: "newsletter",
  isDefault: true,
  isPublic: true,
  tags: ["newsletter", "classique", "simple"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#1976d2",
    secondaryColor: "#64b5f6",
    accentColor: "#ffc107",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        logoUrl: "",
        title: "📬 Actualités Krysto",
        subtitle: "Votre newsletter mensuelle",
        alignment: "center",
        backgroundColor: "#1976d2",
        titleColor: "#ffffff",
        subtitleColor: "#e3f2fd",
        titleFontSize: 28,
        subtitleFontSize: 14,
        showIcon: false,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Bonjour,</p><p>Découvrez les dernières actualités de Krysto et nos nouveaux produits éco-responsables fabriqués en Nouvelle-Calédonie.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 30, paddingBottom: 10, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "image",
      data: {
        src: "",
        alt: "Image newsletter",
        width: "100%",
        alignment: "center",
        borderRadius: 12,
      },
      styles: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Continuez à lire pour découvrir nos dernières nouvelles et offres exclusives...</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "En savoir plus",
        url: "#",
        alignment: "center",
        backgroundColor: "#1976d2",
        textColor: "#ffffff",
        fontSize: 16,
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 32,
      },
      styles: { paddingTop: 10, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        unsubscribeText: "Se désinscrire",
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#1976d2",
        alignment: "center",
        copyright: "Produits éco-responsables en plastique recyclé 🌿",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, borderRadius: 0 },
    },
  ],
};

// ==========================================
// TEMPLATE: PROMOTION
// ==========================================
export const promoTemplate = {
  name: "Promotion",
  description: "Template accrocheur pour vos offres promotionnelles avec code promo",
  category: "promo",
  isDefault: true,
  isPublic: true,
  tags: ["promo", "promotion", "offre", "réduction"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#e53935",
    secondaryColor: "#ff6f60",
    accentColor: "#ffc107",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        title: "🏷️ Offre Spéciale !",
        subtitle: "Durée limitée",
        alignment: "center",
        backgroundColor: "#e53935",
        titleColor: "#ffffff",
        subtitleColor: "#ffcdd2",
        titleFontSize: 32,
        subtitleFontSize: 14,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "image",
      data: {
        src: "",
        alt: "Image promotion",
        width: "100%",
        alignment: "center",
        borderRadius: 12,
      },
      styles: { paddingTop: 30, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Profitez de notre offre exceptionnelle ! Pour une durée limitée, bénéficiez d'une réduction exclusive sur une sélection de produits éco-responsables.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "promo-code",
      data: {
        code: "PROMO20",
        description: "Votre code promo exclusif",
        discount: "-20%",
        expiryDate: null,
        showExpiry: true,
        backgroundColor: "#ffebee",
        borderColor: "#e53935",
        codeColor: "#e53935",
        textColor: "#333333",
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "Profiter de l'offre →",
        url: "#",
        alignment: "center",
        backgroundColor: "#e53935",
        textColor: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 40,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p style='text-align: center; color: #666; font-size: 14px;'>⏰ <strong>Offre limitée</strong> - Ne manquez pas cette occasion !</p>",
        alignment: "center",
        textColor: "#666666",
        fontSize: 14,
      },
      styles: { paddingTop: 0, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, backgroundColor: "#fff8e1" },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#e53935",
        alignment: "center",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
  ],
};

// ==========================================
// TEMPLATE: NOUVEAUTÉS
// ==========================================
export const nouveautesTemplate = {
  name: "Nouveautés",
  description: "Présentez vos nouveaux produits avec élégance",
  category: "nouveautes",
  isDefault: true,
  isPublic: true,
  tags: ["nouveautés", "produits", "lancement"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#2d6a4f",
    secondaryColor: "#40916c",
    accentColor: "#95d5b2",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        title: "✨ Nouveautés",
        subtitle: "Découvrez nos dernières créations",
        alignment: "center",
        backgroundColor: "#2d6a4f",
        titleColor: "#ffffff",
        subtitleColor: "#95d5b2",
        titleFontSize: 32,
        subtitleFontSize: 14,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Bonjour,</p><p>Nous sommes ravis de vous présenter nos dernières créations ! Chaque produit est fabriqué avec soin à partir de plastique 100% recyclé en Nouvelle-Calédonie.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 30, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "product-card",
      data: {
        imageUrl: "",
        name: "Nouveau Produit",
        description: "Description du produit éco-responsable",
        price: "2 500 XPF",
        oldPrice: "",
        buttonText: "Découvrir",
        buttonUrl: "#",
        showPrice: true,
        showButton: true,
        layout: "vertical",
        backgroundColor: "#ffffff",
        borderColor: "#e8f5e9",
      },
      styles: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "divider",
      data: {
        style: "solid",
        color: "#e8f5e9",
        thickness: 2,
        width: "50%",
        alignment: "center",
      },
      styles: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p style='text-align: center; color: #2d6a4f;'>🌿 Comme tous nos produits, fabriqué à partir de plastique 100% recyclé en Nouvelle-Calédonie</p>",
        alignment: "center",
        textColor: "#2d6a4f",
        fontSize: 15,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40, backgroundColor: "#e8f5e9" },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "Voir toutes les nouveautés",
        url: "#",
        alignment: "center",
        backgroundColor: "#2d6a4f",
        textColor: "#ffffff",
        fontSize: 16,
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 32,
      },
      styles: { paddingTop: 20, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#2d6a4f",
        alignment: "center",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
  ],
};

// ==========================================
// TEMPLATE: DÉSTOCKAGE
// ==========================================
export const destockageTemplate = {
  name: "Déstockage",
  description: "Template percutant pour vos ventes de déstockage",
  category: "destockage",
  isDefault: true,
  isPublic: true,
  tags: ["déstockage", "soldes", "vente", "urgence"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#f57c00",
    secondaryColor: "#ffb74d",
    accentColor: "#ffe0b2",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        title: "🔥 DÉSTOCKAGE",
        subtitle: "Jusqu'à épuisement des stocks",
        alignment: "center",
        backgroundColor: "#f57c00",
        titleColor: "#ffffff",
        subtitleColor: "#ffe0b2",
        titleFontSize: 36,
        subtitleFontSize: 14,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p style='text-align: center; font-size: 48px; font-weight: 800; color: #f57c00; margin: 0;'>-50%</p><p style='text-align: center; color: #666;'>Sur une sélection d'articles</p>",
        alignment: "center",
        fontSize: 16,
      },
      styles: { paddingTop: 30, paddingBottom: 20, paddingLeft: 40, paddingRight: 40, backgroundColor: "#fff3e0" },
    },
    {
      id: generateBlockId(),
      type: "image",
      data: {
        src: "",
        alt: "Image déstockage",
        width: "100%",
        alignment: "center",
        borderRadius: 12,
      },
      styles: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>C'est le moment de faire de bonnes affaires ! Profitez de remises exceptionnelles sur une sélection de produits éco-responsables.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p style='margin: 0;'>⚡ <strong>Stock très limité</strong> - Premier arrivé, premier servi !</p>",
        alignment: "left",
        textColor: "#e65100",
        fontSize: 14,
      },
      styles: { paddingTop: 15, paddingBottom: 15, paddingLeft: 40, paddingRight: 40, backgroundColor: "#fff3e0" },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "Voir le déstockage →",
        url: "#",
        alignment: "center",
        backgroundColor: "#f57c00",
        textColor: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 40,
      },
      styles: { paddingTop: 20, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#f57c00",
        alignment: "center",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
  ],
};

// ==========================================
// TEMPLATE: ÉVÉNEMENT
// ==========================================
export const evenementTemplate = {
  name: "Événement",
  description: "Invitez vos clients à vos événements",
  category: "evenement",
  isDefault: true,
  isPublic: true,
  tags: ["événement", "invitation", "fête"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#7b1fa2",
    secondaryColor: "#ba68c8",
    accentColor: "#f3e5f5",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        title: "🎉 Événement Spécial",
        subtitle: "Vous êtes invité(e) !",
        alignment: "center",
        backgroundColor: "#7b1fa2",
        titleColor: "#ffffff",
        subtitleColor: "#e1bee7",
        titleFontSize: 32,
        subtitleFontSize: 14,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "image",
      data: {
        src: "",
        alt: "Image événement",
        width: "100%",
        alignment: "center",
        borderRadius: 12,
      },
      styles: { paddingTop: 30, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Nous avons le plaisir de vous convier à un événement exceptionnel !</p><p>Venez découvrir nos nouveautés et rencontrer notre équipe dans une ambiance conviviale.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 10, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p style='text-align: center; margin: 0;'>🎊 Rejoignez-nous pour cet événement exceptionnel !</p>",
        alignment: "center",
        textColor: "#7b1fa2",
        fontSize: 16,
      },
      styles: { paddingTop: 25, paddingBottom: 25, paddingLeft: 40, paddingRight: 40, backgroundColor: "#f3e5f5" },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "Je participe",
        url: "#",
        alignment: "center",
        backgroundColor: "#7b1fa2",
        textColor: "#ffffff",
        fontSize: 16,
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 40,
      },
      styles: { paddingTop: 20, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#7b1fa2",
        alignment: "center",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
  ],
};

// ==========================================
// TEMPLATE: BIENVENUE
// ==========================================
export const bienvenueTemplate = {
  name: "Bienvenue",
  description: "Email de bienvenue pour les nouveaux inscrits",
  category: "bienvenue",
  isDefault: true,
  isPublic: true,
  tags: ["bienvenue", "inscription", "nouveau"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#00897b",
    secondaryColor: "#4db6ac",
    accentColor: "#e0f2f1",
    borderRadius: 16,
    contentPadding: 0,
  },
  blocks: [
    {
      id: generateBlockId(),
      type: "header",
      data: {
        title: "👋 Bienvenue !",
        subtitle: "Merci de nous rejoindre",
        alignment: "center",
        backgroundColor: "#00897b",
        titleColor: "#ffffff",
        subtitleColor: "#b2dfdb",
        titleFontSize: 32,
        subtitleFontSize: 14,
      },
      styles: { paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<p>Bonjour et bienvenue dans la communauté Krysto !</p><p>Nous sommes ravis de vous compter parmi nous. En tant que membre, vous bénéficierez d'avantages exclusifs et serez informé(e) en avant-première de nos nouveautés.</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.7,
      },
      styles: { paddingTop: 30, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "divider",
      data: {
        style: "solid",
        color: "#e0f2f1",
        thickness: 2,
        width: "30%",
        alignment: "center",
      },
      styles: { paddingTop: 10, paddingBottom: 10, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "text",
      data: {
        content: "<h3 style='color: #00897b; margin-bottom: 15px;'>Ce que vous allez découvrir :</h3><p>✅ Des produits éco-responsables uniques<br/>✅ Des offres exclusives réservées aux membres<br/>✅ L'histoire de nos créations<br/>✅ Des conseils pour un mode de vie durable</p>",
        alignment: "left",
        textColor: "#333333",
        fontSize: 16,
        lineHeight: 1.8,
      },
      styles: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "button",
      data: {
        text: "Découvrir la boutique",
        url: "#",
        alignment: "center",
        backgroundColor: "#00897b",
        textColor: "#ffffff",
        fontSize: 16,
        borderRadius: 25,
        paddingVertical: 14,
        paddingHorizontal: 32,
      },
      styles: { paddingTop: 10, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
    {
      id: generateBlockId(),
      type: "footer",
      data: {
        companyName: "Krysto",
        companyAddress: "Nouvelle-Calédonie 🇳🇨",
        showUnsubscribe: true,
        backgroundColor: "#f5f5f5",
        textColor: "#888888",
        linkColor: "#00897b",
        alignment: "center",
        copyright: "Produits éco-responsables en plastique recyclé 🌿",
      },
      styles: { paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40 },
    },
  ],
};

// ==========================================
// TEMPLATE: BLANK (Vide)
// ==========================================
export const blankTemplate = {
  name: "Blank - Partir de zéro",
  description: "Template vide pour créer votre email de A à Z",
  category: "custom",
  isDefault: true,
  isPublic: true,
  tags: ["vide", "blank", "personnalisé", "custom"],
  settings: {
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    primaryColor: "#2d6a4f",
    secondaryColor: "#40916c",
    accentColor: "#ffc107",
    borderRadius: 16,
    contentPadding: 20,
  },
  blocks: [],
};

// ==========================================
// EXPORT DE TOUS LES TEMPLATES
// ==========================================
export const defaultTemplates = [
  blankTemplate,
  newsletterTemplate,
  promoTemplate,
  nouveautesTemplate,
  destockageTemplate,
  evenementTemplate,
  bienvenueTemplate,
];

export default defaultTemplates;