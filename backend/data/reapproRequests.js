// ============================================
// REAPPRO REQUESTS SEED DATA
// ============================================
// userIndex: correspond à l'index dans users.js
// productIndex: correspond à l'index dans products.js
// processedByIndex: correspond à l'index admin dans users.js
//
// Users Pro (rappel):
// - Index 8: Valérie Durand (Boutique Océane) - Revendeur
// - Index 9: Marc Paita (EcoShop Pacific) - Revendeur
// - Index 10: Anna Karé (Galerie Artisanale) - Dépôt-vente

const reapproRequests = [
  // ============================================
  // DEMANDES EN ATTENTE (pending) - Différentes priorités
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 0, // Cache-pot Marbré
        name: "Cache-pot Marbré",
        image: "/images/cache_pot.jpg",
        currentStock: 2,
        requestedQuantity: 15,
        approvedQuantity: 0,
        unitPrice: 1350,
        notes: "Stock critique",
      },
      {
        productIndex: 1, // Sous-verres
        name: "Lot de 4 Sous-verres",
        image: "/images/sous_verre.jpg",
        currentStock: 5,
        requestedQuantity: 20,
        approvedQuantity: 0,
        unitPrice: 900,
        notes: "",
      },
    ],
    priority: "urgent",
    status: "pending",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-25"),
    estimatedDeliveryDate: null,
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Stock très bas, besoin urgent avant le week-end",
    internalNotes: "",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-18") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-18") },
    ],
    processedByIndex: null,
    processedAt: null,
  },
  {
    userIndex: 9, // Marc - EcoShop Pacific
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 4, // Lunettes Coral
        name: "Lunettes de Soleil Coral",
        image: "/images/lunettes.webp",
        currentStock: 3,
        requestedQuantity: 25,
        approvedQuantity: 0,
        unitPrice: 3150,
        notes: "Forte demande client",
      },
    ],
    priority: "high",
    status: "pending",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-30"),
    estimatedDeliveryDate: null,
    deliveryMethod: "pickup",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Saison estivale, forte demande",
    internalNotes: "",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-17") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-17") },
    ],
    processedByIndex: null,
    processedAt: null,
  },
  {
    userIndex: 10, // Anna - Galerie Artisanale
    partnershipType: "depot_vente",
    items: [
      {
        productIndex: 7, // Bagues et Perles
        name: "Bagues et Perles Artisanales",
        image: "/images/lot_bague_perle.jpg",
        currentStock: 8,
        requestedQuantity: 15,
        approvedQuantity: 0,
        unitPrice: 1430,
        notes: "",
      },
    ],
    priority: "normal",
    status: "pending",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-02-05"),
    estimatedDeliveryDate: null,
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "",
    internalNotes: "",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-19") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-19") },
    ],
    processedByIndex: null,
    processedAt: null,
  },

  // ============================================
  // DEMANDE APPROUVÉE (approved)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 2, // Peigne GM
        name: "Peigne Grand Modèle",
        image: "/images/peigne_gm.jpg",
        currentStock: 4,
        requestedQuantity: 20,
        approvedQuantity: 20,
        unitPrice: 675,
        notes: "",
      },
      {
        productIndex: 3, // Pack Salle de Bain
        name: "Pack Salle de Bain",
        image: "/images/pack_salle_de_bains.jpg",
        currentStock: 1,
        requestedQuantity: 10,
        approvedQuantity: 10,
        unitPrice: 2625,
        notes: "",
      },
    ],
    priority: "normal",
    status: "approved",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-22"),
    estimatedDeliveryDate: new Date("2025-01-24"),
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "",
    internalNotes: "Stock disponible, approuvé",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-14") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-14") },
      { action: "Demande approuvée", status: "approved", note: "Stock OK", date: new Date("2025-01-15") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2025-01-15"),
  },

  // ============================================
  // DEMANDE PARTIELLEMENT APPROUVÉE (partial)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 5, // Jenga
        name: "Jeu Jenga Recyclé",
        image: "/images/jenga.jpg",
        currentStock: 0,
        requestedQuantity: 20,
        approvedQuantity: 12, // Stock limité
        unitPrice: 3850,
        notes: "Stock insuffisant",
      },
      {
        productIndex: 9, // Coffret Noël
        name: "Coffret Cadeau Noël",
        image: "/images/pack_noel.jpg",
        currentStock: 2,
        requestedQuantity: 15,
        approvedQuantity: 8, // Stock limité
        unitPrice: 3360,
        notes: "Derniers exemplaires",
      },
    ],
    priority: "high",
    status: "partial",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-20"),
    estimatedDeliveryDate: new Date("2025-01-22"),
    deliveryMethod: "pickup",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Besoin pour réassort boutique",
    internalNotes: "Quantités réduites - stock limité",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-12") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-12") },
      { action: "Partiellement approuvée", status: "partial", note: "Stock insuffisant pour quantités demandées", date: new Date("2025-01-13") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2025-01-13"),
  },

  // ============================================
  // DEMANDE EN PRÉPARATION (processing)
  // ============================================
  {
    userIndex: 10, // Anna - Galerie Artisanale
    partnershipType: "depot_vente",
    items: [
      {
        productIndex: 10, // Dessous de verre Terrazzo
        name: "Set de 6 Dessous de Verre Terrazzo",
        image: "/images/cache_pot_sous_verre.jpg",
        currentStock: 3,
        requestedQuantity: 12,
        approvedQuantity: 12,
        unitPrice: 1625,
        notes: "",
      },
    ],
    priority: "normal",
    status: "processing",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-18"),
    estimatedDeliveryDate: new Date("2025-01-20"),
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: false,
      companyName: "Galerie Artisanale du Pacifique",
      contactName: "Anna Karé",
      street: "3 Place des Cocotiers",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
      phone: "687 79 44 55",
    },
    customerNotes: "",
    internalNotes: "En cours de préparation",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-10") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-10") },
      { action: "Demande approuvée", status: "approved", note: "", date: new Date("2025-01-11") },
      { action: "En préparation", status: "processing", note: "", date: new Date("2025-01-15") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2025-01-11"),
  },

  // ============================================
  // DEMANDE PRÊTE (ready)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 6, // Stylos
        name: "Lot de 5 Stylos",
        image: "/images/stylos.webp",
        currentStock: 10,
        requestedQuantity: 30,
        approvedQuantity: 30,
        unitPrice: 1125,
        notes: "",
      },
    ],
    priority: "low",
    status: "ready",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2025-01-15"),
    estimatedDeliveryDate: new Date("2025-01-16"),
    deliveryMethod: "pickup",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Enlèvement prévu jeudi",
    internalNotes: "Prêt pour enlèvement",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-08") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-08") },
      { action: "Demande approuvée", status: "approved", note: "", date: new Date("2025-01-09") },
      { action: "En préparation", status: "processing", note: "", date: new Date("2025-01-10") },
      { action: "Prête pour enlèvement", status: "ready", note: "", date: new Date("2025-01-14") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2025-01-09"),
  },

  // ============================================
  // DEMANDES TERMINÉES (completed)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 0, // Cache-pot Marbré
        name: "Cache-pot Marbré",
        image: "/images/cache_pot.jpg",
        currentStock: 5,
        requestedQuantity: 20,
        approvedQuantity: 20,
        unitPrice: 1260,
        notes: "",
      },
      {
        productIndex: 8, // Cache-pot Blanc
        name: "Cache-pot Blanc Premium",
        image: "/images/cache_pot_blanc.jpg",
        currentStock: 3,
        requestedQuantity: 15,
        approvedQuantity: 15,
        unitPrice: 1400,
        notes: "",
      },
    ],
    priority: "normal",
    status: "completed",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2024-12-20"),
    estimatedDeliveryDate: new Date("2024-12-22"),
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "",
    internalNotes: "Livré et facturé",
    generatedOrder: null, // Sera lié à une proOrder
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2024-12-15") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2024-12-15") },
      { action: "Demande approuvée", status: "approved", note: "", date: new Date("2024-12-16") },
      { action: "En préparation", status: "processing", note: "", date: new Date("2024-12-18") },
      { action: "Prête", status: "ready", note: "", date: new Date("2024-12-20") },
      { action: "Terminée", status: "completed", note: "Commande PRO-2024-00005 générée", date: new Date("2024-12-22") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2024-12-16"),
  },
  {
    userIndex: 10, // Anna - Galerie Artisanale
    partnershipType: "depot_vente",
    items: [
      {
        productIndex: 7, // Bagues et Perles
        name: "Bagues et Perles Artisanales",
        image: "/images/lot_bague_perle.jpg",
        currentStock: 2,
        requestedQuantity: 20,
        approvedQuantity: 20,
        unitPrice: 1430,
        notes: "",
      },
    ],
    priority: "normal",
    status: "completed",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2024-11-25"),
    estimatedDeliveryDate: new Date("2024-11-27"),
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "",
    internalNotes: "Réappro effectuée",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2024-11-20") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2024-11-20") },
      { action: "Demande approuvée", status: "approved", note: "", date: new Date("2024-11-21") },
      { action: "Terminée", status: "completed", note: "", date: new Date("2024-11-27") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2024-11-21"),
  },

  // ============================================
  // DEMANDE REJETÉE (rejected)
  // ============================================
  {
    userIndex: 9, // Marc - EcoShop Pacific
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 12, // Lampe Bureau (coming soon)
        name: "Lampe de Bureau Éco",
        image: "/images/sample.jpg",
        currentStock: 0,
        requestedQuantity: 10,
        approvedQuantity: 0,
        unitPrice: 4550,
        notes: "",
      },
    ],
    priority: "normal",
    status: "rejected",
    rejectionReason: "Produit pas encore disponible. Lancement prévu en mars 2025.",
    requestedDeliveryDate: new Date("2025-01-20"),
    estimatedDeliveryDate: null,
    deliveryMethod: "pickup",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Anticipation nouvelle collection",
    internalNotes: "Produit en coming soon",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-05") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2025-01-05") },
      { action: "Demande rejetée", status: "rejected", note: "Produit non disponible", date: new Date("2025-01-06") },
    ],
    processedByIndex: 0,
    processedAt: new Date("2025-01-06"),
  },

  // ============================================
  // DEMANDE ANNULÉE (cancelled)
  // ============================================
  {
    userIndex: 8, // Valérie - Boutique Océane
    partnershipType: "revendeur",
    items: [
      {
        productIndex: 9, // Coffret Noël
        name: "Coffret Cadeau Noël",
        image: "/images/pack_noel.jpg",
        currentStock: 5,
        requestedQuantity: 25,
        approvedQuantity: 0,
        unitPrice: 3600,
        notes: "",
      },
    ],
    priority: "high",
    status: "cancelled",
    rejectionReason: "",
    requestedDeliveryDate: new Date("2024-12-15"),
    estimatedDeliveryDate: null,
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "Annulé - commande client annulée",
    internalNotes: "Client a annulé sa demande",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2024-12-10") },
      { action: "Demande soumise", status: "pending", note: "", date: new Date("2024-12-10") },
      { action: "Annulée par le client", status: "cancelled", note: "Commande client annulée", date: new Date("2024-12-11") },
    ],
    processedByIndex: null,
    processedAt: null,
  },

  // ============================================
  // DEMANDE BROUILLON (draft)
  // ============================================
  {
    userIndex: 10, // Anna - Galerie Artisanale
    partnershipType: "depot_vente",
    items: [
      {
        productIndex: 11, // Chaussons bébé
        name: "Chaussons Bébé fait main crochet",
        image: "/images/chausson.jfif",
        currentStock: 0,
        requestedQuantity: 10,
        approvedQuantity: 0,
        unitPrice: 1625,
        notes: "",
      },
    ],
    priority: "low",
    status: "draft",
    rejectionReason: "",
    requestedDeliveryDate: null,
    estimatedDeliveryDate: null,
    deliveryMethod: "delivery",
    deliveryAddress: {
      useDefault: true,
    },
    customerNotes: "",
    internalNotes: "",
    generatedOrder: null,
    history: [
      { action: "Demande créée", status: "draft", note: "", date: new Date("2025-01-19") },
    ],
    processedByIndex: null,
    processedAt: null,
  },
];

export default reapproRequests;
