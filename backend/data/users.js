import bcrypt from "bcryptjs";

// ============================================
// USERS SEED DATA
// ============================================
// Index 0-1: Admins
// Index 2-5: Utilisateurs standards
// Index 6: Utilisateur avec demande Pro en attente
// Index 7: Utilisateur Pro suspendu
// Index 8-10: Utilisateurs Pro approuvés
// Index 11: Utilisateur sans newsletter (jamais inscrit)

const users = [
  // ============================================
  // ADMINISTRATEURS (index 0-1)
  // ============================================
  {
    // Index 0
    name: "Admin Krysto",
    email: "admin@krysto.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-01-01"),
    newsletterUnsubscribedAt: null,
  },
  {
    // Index 1
    name: "Super Admin",
    email: "superadmin@krysto.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: false,
    newsletterSubscribedAt: null,
    newsletterUnsubscribedAt: null,
  },

  // ============================================
  // UTILISATEURS STANDARDS (index 2-5)
  // ============================================
  {
    // Index 2 - Newsletter active
    name: "Marie Dupont",
    email: "marie.dupont@email.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-06-15"),
    newsletterUnsubscribedAt: null,
  },
  {
    // Index 3 - Newsletter désabonnée
    name: "Jean-Pierre Moana",
    email: "jpmoana@lagoon.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: false,
    newsletterSubscribedAt: new Date("2024-03-10"),
    newsletterUnsubscribedAt: new Date("2024-08-15"),
  },
  {
    // Index 4 - Utilisateur récent avec newsletter
    name: "Sophie Martin",
    email: "sophie.martin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-12-01"),
    newsletterUnsubscribedAt: null,
  },
  {
    // Index 5 - Utilisateur actif sans newsletter
    name: "Teva Teuru",
    email: "teva.teuru@outlook.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: false,
    newsletterSubscribedAt: null,
    newsletterUnsubscribedAt: null,
  },

  // ============================================
  // UTILISATEUR PRO EN ATTENTE (index 6)
  // ============================================
  {
    // Index 6 - A fait une demande Pro (pending)
    name: "Pierre Lefevre",
    email: "pierre.lefevre@business.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "pending",
    proInfo: {},
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-11-01"),
    newsletterUnsubscribedAt: null,
  },

  // ============================================
  // UTILISATEUR PRO SUSPENDU (index 7)
  // ============================================
  {
    // Index 7 - Compte Pro suspendu
    name: "Lucas Mercier",
    email: "lucas.mercier@suspended.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "suspended",
    proInfo: {
      companyName: "Mercier & Co",
      legalStatus: "SARL",
      ridetNumber: "9999888.001",
      partnershipType: "revendeur",
      address: {
        street: "10 Rue Inactive",
        city: "Nouméa",
        postalCode: "98800",
        country: "Nouvelle-Calédonie",
      },
      contactPhone: "687 99 88 77",
      contactEmail: "lucas.mercier@suspended.nc",
      contactFirstName: "Lucas",
      contactLastName: "Mercier",
      discountRate: 20,
      approvedAt: new Date("2024-06-01"),
      approvedBy: null,
      adminNotes: "Suspendu le 15/10/2024 - Impayés répétés",
    },
    newsletterSubscribed: false,
    newsletterSubscribedAt: new Date("2024-06-01"),
    newsletterUnsubscribedAt: new Date("2024-10-15"),
  },

  // ============================================
  // UTILISATEURS PRO APPROUVÉS (index 8-10)
  // ============================================
  {
    // Index 8 - Pro Revendeur actif
    name: "Valérie Durand",
    email: "valerie@boutique-oceane.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: true,
    proStatus: "approved",
    proInfo: {
      companyName: "Boutique Océane",
      legalStatus: "SARL",
      ridetNumber: "7788990.001",
      partnershipType: "revendeur",
      address: {
        street: "23 Rue Jean Jaurès",
        city: "Nouméa",
        postalCode: "98800",
        country: "Nouvelle-Calédonie",
      },
      contactPhone: "687 75 00 11",
      contactEmail: "valerie@boutique-oceane.nc",
      contactFirstName: "Valérie",
      contactLastName: "Durand",
      discountRate: 25,
      approvedAt: new Date("2024-09-20"),
      approvedBy: null, // Will be set to admin ObjectId in seeder
      adminNotes: "Excellente partenaire. Commandes régulières.",
    },
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-09-20"),
    newsletterUnsubscribedAt: null,
  },
  {
    // Index 9 - Pro Revendeur actif (grosse remise)
    name: "Marc Paita",
    email: "marc@ecoshop-pacific.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: true,
    proStatus: "approved",
    proInfo: {
      companyName: "EcoShop Pacific",
      legalStatus: "SAS",
      ridetNumber: "1122334.001",
      partnershipType: "revendeur",
      address: {
        street: "15 Boulevard Vauban",
        city: "Nouméa",
        postalCode: "98800",
        country: "Nouvelle-Calédonie",
      },
      contactPhone: "687 76 22 33",
      contactEmail: "marc@ecoshop-pacific.nc",
      contactFirstName: "Marc",
      contactLastName: "Paita",
      discountRate: 30,
      approvedAt: new Date("2024-10-05"),
      approvedBy: null,
      adminNotes: "Partenaire stratégique - Volume important",
    },
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-10-05"),
    newsletterUnsubscribedAt: null,
  },
  {
    // Index 10 - Pro Dépôt-vente actif
    name: "Anna Karé",
    email: "anna@galerie-artisanale.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: true,
    proStatus: "approved",
    proInfo: {
      companyName: "Galerie Artisanale du Pacifique",
      legalStatus: "EI",
      ridetNumber: "6677889.001",
      partnershipType: "depot_vente",
      address: {
        street: "3 Place des Cocotiers",
        city: "Nouméa",
        postalCode: "98800",
        country: "Nouvelle-Calédonie",
      },
      contactPhone: "687 79 44 55",
      contactEmail: "anna@galerie-artisanale.nc",
      contactFirstName: "Anna",
      contactLastName: "Karé",
      discountRate: 35,
      approvedAt: new Date("2024-11-12"),
      approvedBy: null,
      adminNotes: "Dépôt-vente - Commission 35% - Emplacement touristique",
    },
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-11-12"),
    newsletterUnsubscribedAt: null,
  },

  // ============================================
  // UTILISATEUR JAMAIS INSCRIT NEWSLETTER (index 11)
  // ============================================
  {
    // Index 11
    name: "Claire Nouveau",
    email: "claire.nouveau@test.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isPro: false,
    proStatus: "none",
    proInfo: {},
    newsletterSubscribed: false,
    newsletterSubscribedAt: null,
    newsletterUnsubscribedAt: null,
  },
];

export default users;
