// URL de base de l'API
// En production, utiliser une variable d'environnement
export const BASE_URL = process.env.REACT_APP_API_URL || "";

// URLs des différentes routes API
export const PRODUCTS_URL = "/api/products";
export const USERS_URL = "/api/users";
export const ORDERS_URL = "/api/orders";
export const UPLOAD_URL = "/api/upload";
export const CONTACTS_URL = "/api/contacts";
export const UNIVERSES_URL = "/api/universes";
export const SUBUNIVERSES_URL = "/api/subuniverses";
export const PROSPECTS_URL = "/api/prospects";
export const MAILING_URL = "/api/mailing";
export const NEWSLETTERS_URL = "/api/newsletters";
export const PRO_REQUESTS_URL = "/api/pro-requests";
export const PRO_ORDERS_URL = "/api/pro-orders";
export const REAPPRO_REQUESTS_URL = "/api/reappro-requests";

// PayPal Client ID (à configurer)
export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || "";

// Configuration du panier
export const CART_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 10000, // XPF
  DEFAULT_SHIPPING_PRICE: 2000, // XPF
  TAX_RATE: 0.22, // 22%
};

// Configuration du panier Pro
export const PRO_CART_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 50000, // XPF
  DEFAULT_SHIPPING_PRICE: 1500, // XPF
  EXPRESS_SHIPPING_PRICE: 3000, // XPF
  DEFAULT_PAYMENT_TERMS: 30, // jours
};

// Statuts des commandes
export const ORDER_STATUS = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

// Statuts des commandes Pro
export const PRO_ORDER_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  READY: "ready",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Statuts des demandes Pro
export const PRO_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

// Statuts des demandes de réapprovisionnement
export const REAPPRO_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  PARTIAL: "partial",
  REJECTED: "rejected",
  PROCESSING: "processing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Types de partenariat
export const PARTNERSHIP_TYPES = {
  RESELLER: "reseller",
  CONSIGNMENT: "consignment",
};

// Labels des types de partenariat
export const PARTNERSHIP_LABELS = {
  reseller: "Revendeur",
  consignment: "Dépôt-vente",
};

// Priorités des demandes de réappro
export const REAPPRO_PRIORITIES = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
};

// Labels des priorités
export const PRIORITY_LABELS = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  urgent: "Urgente",
};

// Méthodes de livraison
export const SHIPPING_METHODS = {
  PICKUP: "pickup",
  DELIVERY: "delivery",
  EXPRESS: "express",
};

// Labels des méthodes de livraison
export const SHIPPING_METHOD_LABELS = {
  pickup: "Retrait sur place",
  delivery: "Livraison standard",
  express: "Livraison express",
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  INVOICE: "invoice",
  TRANSFER: "transfer",
  CASH: "cash",
  CHECK: "check",
};

// Labels des méthodes de paiement
export const PAYMENT_METHOD_LABELS = {
  invoice: "Facture (paiement différé)",
  transfer: "Virement bancaire",
  cash: "Espèces",
  check: "Chèque",
};

// Statuts des prospects
export const PROSPECT_STATUS = {
  ACTIVE: "active",
  UNSUBSCRIBED: "unsubscribed",
  CONVERTED: "converted",
  BOUNCED: "bounced",
};

// Sources des prospects
export const PROSPECT_SOURCES = {
  LANDING_PAGE: "landing_page",
  CHECKOUT: "checkout",
  MANUAL: "manual",
  IMPORT: "import",
};

// Statuts des contacts
export const CONTACT_STATUS = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

// Sujets des contacts
export const CONTACT_SUBJECTS = {
  GENERAL: "general",
  SUPPORT: "support",
  ORDER: "order",
  PARTNERSHIP: "partnership",
  OTHER: "other",
};

// Statuts des produits
export const PRODUCT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
};