// ============================================
// PRO ORDERS SEED DATA
// ============================================
// userIndex: correspond à l'index dans users.js
// productIndex: correspond à l'index dans products.js
// processedByIndex: correspond à l'index admin dans users.js
//
// Users Pro (rappel):
// - Index 8: Valérie Durand (Boutique Océane) - Revendeur 25%
// - Index 9: Marc Paita (EcoShop Pacific) - Revendeur 30%
// - Index 10: Anna Karé (Galerie Artisanale) - Dépôt-vente 35%

const proOrders = [
  // ============================================
  // COMMANDES TERMINÉES (completed)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    orderType: "revendeur",
    items: [
      {
        productIndex: 0, // Cache-pot Marbré
        name: "Cache-pot Marbré",
        image: "/images/cache_pot.jpg",
        quantity: 10,
        unitPrice: 1800,
        proPrice: 1350, // -25%
        lineTotal: 13500,
        notes: "",
      },
      {
        productIndex: 1, // Sous-verres
        name: "Lot de 4 Sous-verres",
        image: "/images/sous_verre.jpg",
        quantity: 15,
        unitPrice: 1200,
        proPrice: 900, // -25%
        lineTotal: 13500,
        notes: "",
      },
    ],
    subtotal: 27000,
    discountRate: 25,
    discountAmount: 9000,
    totalAmount: 27000,
    shippingAddress: {
      companyName: "Boutique Océane",
      contactName: "Valérie Durand",
      street: "23 Rue Jean Jaurès",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 75 00 11",
    },
    shippingMethod: "delivery",
    shippingCost: 0,
    paymentMethod: "invoice",
    paymentTerms: 30,
    status: "completed",
    paymentStatus: "paid",
    paidAmount: 27000,
    confirmedAt: new Date("2024-10-01"),
    shippedAt: new Date("2024-10-03"),
    deliveredAt: new Date("2024-10-04"),
    paidAt: new Date("2024-10-20"),
    paymentDueDate: new Date("2024-10-31"),
    invoiceNumber: "PRO-2024-00001",
    customerNotes: "Merci de livrer le matin",
    internalNotes: "Cliente fidèle",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2024-09-28") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2024-10-01") },
      { action: "Commande expédiée", status: "shipped", note: "", date: new Date("2024-10-03") },
      { action: "Commande livrée", status: "delivered", note: "", date: new Date("2024-10-04") },
      { action: "Paiement reçu: 27000 XPF", status: "completed", note: "Virement reçu", date: new Date("2024-10-20") },
    ],
    processedByIndex: 0,
  },
  {
    userIndex: 9, // Marc - EcoShop Pacific
    orderType: "revendeur",
    items: [
      {
        productIndex: 4, // Lunettes Coral
        name: "Lunettes de Soleil Coral",
        image: "/images/lunettes.webp",
        quantity: 20,
        unitPrice: 4500,
        proPrice: 3150, // -30%
        lineTotal: 63000,
        notes: "Modèle best-seller",
      },
      {
        productIndex: 5, // Jenga
        name: "Jeu Jenga Recyclé",
        image: "/images/jenga.jpg",
        quantity: 8,
        unitPrice: 5500,
        proPrice: 3850, // -30%
        lineTotal: 30800,
        notes: "",
      },
    ],
    subtotal: 93800,
    discountRate: 30,
    discountAmount: 40200,
    totalAmount: 93800,
    shippingAddress: {
      companyName: "EcoShop Pacific",
      contactName: "Marc Paita",
      street: "15 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 76 22 33",
    },
    shippingMethod: "pickup",
    shippingCost: 0,
    paymentMethod: "transfer",
    paymentTerms: 45,
    status: "completed",
    paymentStatus: "paid",
    paidAmount: 93800,
    confirmedAt: new Date("2024-11-05"),
    shippedAt: null,
    deliveredAt: new Date("2024-11-07"),
    paidAt: new Date("2024-12-01"),
    paymentDueDate: new Date("2024-12-20"),
    invoiceNumber: "PRO-2024-00002",
    customerNotes: "Enlèvement prévu vendredi",
    internalNotes: "Gros volume - partenaire stratégique",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2024-11-03") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2024-11-05") },
      { action: "Prête pour enlèvement", status: "ready", note: "", date: new Date("2024-11-07") },
      { action: "Commande récupérée", status: "delivered", note: "", date: new Date("2024-11-07") },
      { action: "Paiement reçu: 93800 XPF", status: "completed", note: "", date: new Date("2024-12-01") },
    ],
    processedByIndex: 0,
  },
  {
    userIndex: 10, // Anna - Galerie Artisanale (dépôt-vente)
    orderType: "depot_vente",
    items: [
      {
        productIndex: 7, // Bagues et Perles
        name: "Bagues et Perles Artisanales",
        image: "/images/lot_bague_perle.jpg",
        quantity: 25,
        unitPrice: 2200,
        proPrice: 1430, // -35%
        lineTotal: 35750,
        notes: "Assortiment de couleurs",
      },
      {
        productIndex: 9, // Coffret Noël
        name: "Coffret Cadeau Noël",
        image: "/images/pack_noel.jpg",
        quantity: 10,
        unitPrice: 4800,
        proPrice: 3120, // -35%
        lineTotal: 31200,
        notes: "Pour les fêtes",
      },
    ],
    subtotal: 66950,
    discountRate: 35,
    discountAmount: 36050,
    totalAmount: 66950,
    shippingAddress: {
      companyName: "Galerie Artisanale du Pacifique",
      contactName: "Anna Karé",
      street: "3 Place des Cocotiers",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 79 44 55",
    },
    shippingMethod: "delivery",
    shippingCost: 500,
    paymentMethod: "invoice",
    paymentTerms: 60,
    status: "completed",
    paymentStatus: "paid",
    paidAmount: 67450,
    confirmedAt: new Date("2024-11-15"),
    shippedAt: new Date("2024-11-17"),
    deliveredAt: new Date("2024-11-18"),
    paidAt: new Date("2024-12-30"),
    paymentDueDate: new Date("2025-01-15"),
    invoiceNumber: "DV-2024-00001",
    customerNotes: "",
    internalNotes: "Dépôt-vente - Suivi mensuel des ventes",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2024-11-12") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2024-11-15") },
      { action: "Commande expédiée", status: "shipped", note: "", date: new Date("2024-11-17") },
      { action: "Commande livrée", status: "delivered", note: "", date: new Date("2024-11-18") },
      { action: "Paiement reçu: 67450 XPF", status: "completed", note: "", date: new Date("2024-12-30") },
    ],
    processedByIndex: 0,
  },

  // ============================================
  // COMMANDE LIVRÉE NON PAYÉE (delivered)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    orderType: "revendeur",
    items: [
      {
        productIndex: 2, // Peigne GM
        name: "Peigne Grand Modèle",
        image: "/images/peigne_gm.jpg",
        quantity: 30,
        unitPrice: 900,
        proPrice: 675, // -25%
        lineTotal: 20250,
        notes: "",
      },
      {
        productIndex: 8, // Cache-pot Blanc
        name: "Cache-pot Blanc Premium",
        image: "/images/cache_pot_blanc.jpg",
        quantity: 12,
        unitPrice: 2000,
        proPrice: 1500, // -25%
        lineTotal: 18000,
        notes: "",
      },
    ],
    subtotal: 38250,
    discountRate: 25,
    discountAmount: 12750,
    totalAmount: 38250,
    shippingAddress: {
      companyName: "Boutique Océane",
      contactName: "Valérie Durand",
      street: "23 Rue Jean Jaurès",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 75 00 11",
    },
    shippingMethod: "delivery",
    shippingCost: 0,
    paymentMethod: "invoice",
    paymentTerms: 30,
    status: "delivered",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: new Date("2024-12-20"),
    shippedAt: new Date("2024-12-22"),
    deliveredAt: new Date("2024-12-23"),
    paidAt: null,
    paymentDueDate: new Date("2025-01-20"),
    invoiceNumber: "PRO-2024-00003",
    customerNotes: "",
    internalNotes: "Attente paiement",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2024-12-18") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2024-12-20") },
      { action: "Commande expédiée", status: "shipped", note: "", date: new Date("2024-12-22") },
      { action: "Commande livrée", status: "delivered", note: "", date: new Date("2024-12-23") },
    ],
    processedByIndex: 0,
  },

  // ============================================
  // COMMANDE EN COURS (processing)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    orderType: "revendeur",
    items: [
      {
        productIndex: 9, // Coffret Noël
        name: "Coffret Cadeau Noël",
        image: "/images/pack_noel.jpg",
        quantity: 15,
        unitPrice: 4800,
        proPrice: 3360, // -30%
        lineTotal: 50400,
        notes: "Urgent pour les fêtes",
      },
    ],
    subtotal: 50400,
    discountRate: 30,
    discountAmount: 21600,
    totalAmount: 50400,
    shippingAddress: {
      companyName: "EcoShop Pacific",
      contactName: "Marc Paita",
      street: "15 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 76 22 33",
    },
    shippingMethod: "pickup",
    shippingCost: 0,
    paymentMethod: "transfer",
    paymentTerms: 30,
    status: "processing",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: new Date("2025-01-10"),
    shippedAt: null,
    deliveredAt: null,
    paidAt: null,
    paymentDueDate: new Date("2025-02-10"),
    invoiceNumber: "PRO-2025-00001",
    customerNotes: "Si possible avant le 15 janvier",
    internalNotes: "En préparation",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2025-01-08") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2025-01-10") },
      { action: "En préparation", status: "processing", note: "", date: new Date("2025-01-11") },
    ],
    processedByIndex: 0,
  },

  // ============================================
  // COMMANDE CONFIRMÉE (confirmed)
  // ============================================
  {
    userIndex: 10, // Anna - Galerie Artisanale
    orderType: "depot_vente",
    items: [
      {
        productIndex: 10, // Dessous de verre Terrazzo
        name: "Set de 6 Dessous de Verre Terrazzo",
        image: "/images/cache_pot_sous_verre.jpg",
        quantity: 20,
        unitPrice: 2500,
        proPrice: 1625, // -35%
        lineTotal: 32500,
        notes: "",
      },
    ],
    subtotal: 32500,
    discountRate: 35,
    discountAmount: 17500,
    totalAmount: 32500,
    shippingAddress: {
      companyName: "Galerie Artisanale du Pacifique",
      contactName: "Anna Karé",
      street: "3 Place des Cocotiers",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 79 44 55",
    },
    shippingMethod: "delivery",
    shippingCost: 500,
    paymentMethod: "invoice",
    paymentTerms: 60,
    status: "confirmed",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: new Date("2025-01-15"),
    shippedAt: null,
    deliveredAt: null,
    paidAt: null,
    paymentDueDate: new Date("2025-03-15"),
    invoiceNumber: "DV-2025-00001",
    customerNotes: "",
    internalNotes: "Attente préparation",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2025-01-12") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2025-01-15") },
    ],
    processedByIndex: 0,
  },

  // ============================================
  // COMMANDE PAIEMENT PARTIEL (partial)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    orderType: "revendeur",
    items: [
      {
        productIndex: 3, // Pack Salle de Bain
        name: "Pack Salle de Bain",
        image: "/images/pack_salle_de_bains.jpg",
        quantity: 25,
        unitPrice: 3500,
        proPrice: 2450, // -30%
        lineTotal: 61250,
        notes: "",
      },
      {
        productIndex: 6, // Stylos
        name: "Lot de 5 Stylos",
        image: "/images/stylos.webp",
        quantity: 50,
        unitPrice: 1500,
        proPrice: 1050, // -30%
        lineTotal: 52500,
        notes: "",
      },
    ],
    subtotal: 113750,
    discountRate: 30,
    discountAmount: 48750,
    totalAmount: 113750,
    shippingAddress: {
      companyName: "EcoShop Pacific",
      contactName: "Marc Paita",
      street: "15 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 76 22 33",
    },
    shippingMethod: "delivery",
    shippingCost: 0,
    paymentMethod: "transfer",
    paymentTerms: 45,
    status: "delivered",
    paymentStatus: "partial",
    paidAmount: 60000,
    confirmedAt: new Date("2024-12-01"),
    shippedAt: new Date("2024-12-03"),
    deliveredAt: new Date("2024-12-04"),
    paidAt: null,
    paymentDueDate: new Date("2025-01-15"),
    invoiceNumber: "PRO-2024-00004",
    customerNotes: "",
    internalNotes: "Paiement en 2 fois accordé",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2024-11-28") },
      { action: "Commande confirmée", status: "confirmed", note: "", date: new Date("2024-12-01") },
      { action: "Commande expédiée", status: "shipped", note: "", date: new Date("2024-12-03") },
      { action: "Commande livrée", status: "delivered", note: "", date: new Date("2024-12-04") },
      { action: "Paiement reçu: 60000 XPF", status: "delivered", note: "Acompte", date: new Date("2024-12-15") },
    ],
    processedByIndex: 0,
  },

  // ============================================
  // COMMANDE EN ATTENTE (pending)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    orderType: "revendeur",
    items: [
      {
        productIndex: 11, // Chaussons bébé
        name: "Chaussons Bébé fait main crochet",
        image: "/images/chausson.jfif",
        quantity: 15,
        unitPrice: 2500,
        proPrice: 1875, // -25%
        lineTotal: 28125,
        notes: "Assortiment tailles",
      },
    ],
    subtotal: 28125,
    discountRate: 25,
    discountAmount: 9375,
    totalAmount: 28125,
    shippingAddress: {
      companyName: "Boutique Océane",
      contactName: "Valérie Durand",
      street: "23 Rue Jean Jaurès",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 75 00 11",
    },
    shippingMethod: "pickup",
    shippingCost: 0,
    paymentMethod: "cash",
    paymentTerms: 0,
    status: "pending",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: null,
    shippedAt: null,
    deliveredAt: null,
    paidAt: null,
    paymentDueDate: null,
    invoiceNumber: "",
    customerNotes: "Paiement à l'enlèvement",
    internalNotes: "Attente confirmation stock",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2025-01-18") },
      { action: "Soumise pour validation", status: "pending", note: "", date: new Date("2025-01-18") },
    ],
    processedByIndex: null,
  },

  // ============================================
  // COMMANDE BROUILLON (draft)
  // ============================================
  {
    userIndex: 10, // Anna - Galerie Artisanale
    orderType: "depot_vente",
    items: [
      {
        productIndex: 0, // Cache-pot Marbré
        name: "Cache-pot Marbré",
        image: "/images/cache_pot.jpg",
        quantity: 8,
        unitPrice: 1800,
        proPrice: 1170, // -35%
        lineTotal: 9360,
        notes: "",
      },
    ],
    subtotal: 9360,
    discountRate: 35,
    discountAmount: 5040,
    totalAmount: 9360,
    shippingAddress: {
      companyName: "Galerie Artisanale du Pacifique",
      contactName: "Anna Karé",
      street: "3 Place des Cocotiers",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 79 44 55",
    },
    shippingMethod: "delivery",
    shippingCost: 500,
    paymentMethod: "invoice",
    paymentTerms: 60,
    status: "draft",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: null,
    shippedAt: null,
    deliveredAt: null,
    paidAt: null,
    paymentDueDate: null,
    invoiceNumber: "",
    customerNotes: "",
    internalNotes: "Brouillon - client réfléchit",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2025-01-19") },
    ],
    processedByIndex: null,
  },

  // ============================================
  // COMMANDE ANNULÉE (cancelled)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    orderType: "revendeur",
    items: [
      {
        productIndex: 12, // Lampe Bureau (coming soon)
        name: "Lampe de Bureau Éco",
        image: "/images/sample.jpg",
        quantity: 10,
        unitPrice: 6500,
        proPrice: 4550, // -30%
        lineTotal: 45500,
        notes: "",
      },
    ],
    subtotal: 45500,
    discountRate: 30,
    discountAmount: 19500,
    totalAmount: 45500,
    shippingAddress: {
      companyName: "EcoShop Pacific",
      contactName: "Marc Paita",
      street: "15 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 76 22 33",
    },
    shippingMethod: "pickup",
    shippingCost: 0,
    paymentMethod: "invoice",
    paymentTerms: 30,
    status: "cancelled",
    paymentStatus: "pending",
    paidAmount: 0,
    confirmedAt: null,
    shippedAt: null,
    deliveredAt: null,
    paidAt: null,
    paymentDueDate: null,
    invoiceNumber: "",
    customerNotes: "",
    internalNotes: "Annulée - produit pas encore disponible",
    history: [
      { action: "Commande créée", status: "draft", note: "", date: new Date("2025-01-05") },
      { action: "Soumise pour validation", status: "pending", note: "", date: new Date("2025-01-05") },
      { action: "Commande annulée", status: "cancelled", note: "Produit non disponible", date: new Date("2025-01-06") },
    ],
    processedByIndex: 0,
  },
];

export default proOrders;
