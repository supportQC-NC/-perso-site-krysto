// ============================================
// PRO REQUESTS SEED DATA
// ============================================
// userIndex: correspond à l'index dans users.js
// processedByIndex: correspond à l'index admin dans users.js
//
// Users disponibles (rappel):
// - Index 0-1: Admins
// - Index 2: Marie Dupont (standard)
// - Index 3: Jean-Pierre Moana (standard)
// - Index 4: Sophie Martin (standard)
// - Index 5: Teva Teuru (standard)
// - Index 6: Pierre Lefevre (proStatus: pending)
// - Index 7: Lucas Mercier (proStatus: suspended)
// - Index 8: Valérie Durand (Pro approved)
// - Index 9: Marc Paita (Pro approved)
// - Index 10: Anna Karé (Pro approved)
// - Index 11: Claire Nouveau (standard)

const proRequests = [
  // ============================================
  // DEMANDES EN ATTENTE (pending)
  // ============================================
  {
    userIndex: 6, // Pierre Lefevre (proStatus: pending)
    firstName: "Pierre",
    lastName: "Lefevre",
    email: "pierre.lefevre@business.nc",
    phone: "687 77 88 99",
    companyName: "Boutique Nature NC",
    legalStatus: "SARL",
    ripidetNumber: "1234567.001",
    address: {
      street: "45 Rue de Sébastopol",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Je souhaite revendre vos produits dans ma boutique spécialisée dans les produits naturels et éco-responsables.",
    status: "pending",
    processedAt: null,
    processedByIndex: null,
    rejectionReason: "",
    adminNotes: "",
  },
  {
    userIndex: 2, // Marie Dupont
    firstName: "Marie-Claire",
    lastName: "Wamytan",
    email: "mc.wamytan@artisanat-kanak.nc",
    phone: "687 88 11 22",
    companyName: "Artisanat Kanak",
    legalStatus: "Association",
    ripidetNumber: "9876543.002",
    address: {
      street: "12 Rue du Commerce",
      city: "Koné",
      postalCode: "98860",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "depot_vente",
    message: "Notre association souhaite proposer vos créations aux touristes. Nous avons un espace dédié à l'artisanat local.",
    status: "pending",
    processedAt: null,
    processedByIndex: null,
    rejectionReason: "",
    adminNotes: "Association connue, bonne réputation",
  },
  {
    userIndex: 4, // Sophie Martin
    firstName: "Thomas",
    lastName: "Martin",
    email: "t.martin@conceptstore.nc",
    phone: "687 92 33 44",
    companyName: "Concept Store Océanie",
    legalStatus: "SAS",
    ripidetNumber: "5544332.001",
    address: {
      street: "8 Avenue de la Victoire",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Nouveau concept store dédié aux marques éco-responsables. Intéressé par une collaboration exclusive.",
    status: "pending",
    processedAt: null,
    processedByIndex: null,
    rejectionReason: "",
    adminNotes: "",
  },

  // ============================================
  // DEMANDES APPROUVÉES (approved)
  // ============================================
  {
    userIndex: 8, // Valérie Durand
    firstName: "Valérie",
    lastName: "Durand",
    email: "valerie@boutique-oceane.nc",
    phone: "687 75 00 11",
    companyName: "Boutique Océane",
    legalStatus: "SARL",
    ripidetNumber: "7788990.001",
    address: {
      street: "23 Rue Jean Jaurès",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Boutique de décoration et cadeaux depuis 10 ans. Clientèle fidèle intéressée par les produits durables.",
    status: "approved",
    processedAt: new Date("2024-09-20"),
    processedByIndex: 0,
    rejectionReason: "",
    adminNotes: "Excellente boutique, très bonne visibilité. Remise accordée: 25%",
  },
  {
    userIndex: 9, // Marc Paita
    firstName: "Marc",
    lastName: "Paita",
    email: "marc@ecoshop-pacific.nc",
    phone: "687 76 22 33",
    companyName: "EcoShop Pacific",
    legalStatus: "SAS",
    ripidetNumber: "1122334.001",
    address: {
      street: "15 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Magasin 100% éco-responsable. Nous recherchons des produits recyclés locaux pour compléter notre offre.",
    status: "approved",
    processedAt: new Date("2024-10-05"),
    processedByIndex: 0,
    rejectionReason: "",
    adminNotes: "Partenaire stratégique. Commandes régulières prévues. Remise: 30%",
  },
  {
    userIndex: 10, // Anna Karé
    firstName: "Anna",
    lastName: "Karé",
    email: "anna@galerie-artisanale.nc",
    phone: "687 79 44 55",
    companyName: "Galerie Artisanale du Pacifique",
    legalStatus: "EI",
    ripidetNumber: "6677889.001",
    address: {
      street: "3 Place des Cocotiers",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "depot_vente",
    message: "Galerie d'artisanat local. Je souhaite présenter vos créations en dépôt-vente dans mon espace.",
    status: "approved",
    processedAt: new Date("2024-11-12"),
    processedByIndex: 0,
    rejectionReason: "",
    adminNotes: "Dépôt-vente avec commission 35%. Excellent emplacement touristique.",
  },

  // ============================================
  // DEMANDES REJETÉES (rejected)
  // ============================================
  {
    userIndex: 3, // Jean-Pierre Moana
    firstName: "Jean",
    lastName: "Dubois",
    email: "jean.dubois@discount-nc.com",
    phone: "687 80 00 00",
    companyName: "Discount NC",
    legalStatus: "SARL",
    ripidetNumber: "0011223.001",
    address: {
      street: "Zone industrielle Ducos",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Nous souhaitons revendre vos produits à prix cassés.",
    status: "rejected",
    processedAt: new Date("2024-08-15"),
    processedByIndex: 0,
    rejectionReason: "Le positionnement discount n'est pas compatible avec notre image de marque artisanale et éco-responsable.",
    adminNotes: "Demande refusée - risque de dévalorisation de la marque",
  },
  {
    userIndex: 5, // Teva Teuru
    firstName: "Sophie",
    lastName: "Tahiti",
    email: "sophie@boutique-tahiti.pf",
    phone: "689 40 50 60",
    companyName: "Boutique Tahiti",
    legalStatus: "SARL",
    ripidetNumber: "PF-12345",
    address: {
      street: "Rue du Commerce",
      city: "Papeete",
      postalCode: "98714",
      country: "Polynésie française",
    },
    partnershipType: "revendeur",
    message: "Nous aimerions distribuer vos produits à Tahiti.",
    status: "rejected",
    processedAt: new Date("2024-09-01"),
    processedByIndex: 0,
    rejectionReason: "Nous ne livrons pas encore en dehors de la Nouvelle-Calédonie. Contactez-nous ultérieurement.",
    adminNotes: "Hors zone de livraison actuelle",
  },

  // ============================================
  // DEMANDE ANNULÉE (cancelled)
  // ============================================
  {
    userIndex: 11, // Claire Nouveau
    firstName: "Paul",
    lastName: "Cancel",
    email: "paul.cancel@test.nc",
    phone: "687 11 22 33",
    companyName: "Projet Abandonné",
    legalStatus: "EI",
    ripidetNumber: "1111111.001",
    address: {
      street: "10 Rue Test",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    partnershipType: "revendeur",
    message: "Je souhaite devenir revendeur.",
    status: "cancelled",
    processedAt: new Date("2024-07-20"),
    processedByIndex: null,
    rejectionReason: "",
    adminNotes: "Le demandeur a annulé sa demande - projet abandonné",
  },
];

export default proRequests;