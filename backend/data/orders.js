// Note: Les champs 'user' et 'product' seront remplacés par les vrais ObjectIds dans le seeder
// userIndex: correspond à l'index dans le tableau users (0 = admin, 1 = superadmin, 2 = marie, etc.)
// productIndex: correspond à l'index dans le tableau products

const orders = [
  // ==========================================
  // COMMANDES LIVRÉES ET PAYÉES
  // ==========================================
  {
    userIndex: 2, // Marie Dupont
    orderItems: [
      {
        name: "Cache-pot Marbré Bleu",
        qty: 2,
        image: "/images/cache_pot.jpg",
        price: 1800,
        productIndex: 0,
      },
      {
        name: "Lot de 4 Sous-verres Multicolores",
        qty: 1,
        image: "/images/sous_verre.jpg",
        price: 1200,
        productIndex: 3,
      },
    ],
    shippingAddress: {
      address: "12 Rue de Sébastopol",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-1234567890",
      status: "COMPLETED",
      update_time: "2024-10-15T10:30:00Z",
      email_address: "marie.dupont@email.nc",
    },
    itemsPrice: 4800,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 5300,
    isPaid: true,
    paidAt: new Date("2024-10-15"),
    isDelivered: true,
    deliveredAt: new Date("2024-10-18"),
    status: "Livrée",
    notes: "Première commande - cliente satisfaite",
  },
  {
    userIndex: 3, // Jean-Pierre Moana
    orderItems: [
      {
        name: "Lunettes de Soleil Coral",
        qty: 1,
        image: "/images/lunettes.webp",
        price: 4500,
        productIndex: 13,
      },
      {
        name: "Peigne Grand Modèle",
        qty: 2,
        image: "/images/peigne_gm.jpg",
        price: 900,
        productIndex: 8,
      },
    ],
    shippingAddress: {
      address: "45 Avenue du Maréchal Foch",
      city: "Dumbéa",
      postalCode: "98835",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-0987654321",
      status: "COMPLETED",
      update_time: "2024-11-02T14:15:00Z",
      email_address: "jpmoana@lagoon.nc",
    },
    itemsPrice: 6300,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 6800,
    isPaid: true,
    paidAt: new Date("2024-11-02"),
    isDelivered: true,
    deliveredAt: new Date("2024-11-05"),
    status: "Livrée",
    notes: "",
  },
  {
    userIndex: 4, // Sophie Martin
    orderItems: [
      {
        name: "Jeu Jenga Recyclé",
        qty: 1,
        image: "/images/jenga.jpg",
        price: 5500,
        productIndex: 17,
      },
      {
        name: "Coffret Cadeau Noël",
        qty: 2,
        image: "/images/pack_noel.jpg",
        price: 4800,
        productIndex: 31,
      },
    ],
    shippingAddress: {
      address: "8 Rue Georges Clémenceau",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-1122334455",
      status: "COMPLETED",
      update_time: "2024-12-10T09:45:00Z",
      email_address: "sophie.martin@gmail.com",
    },
    itemsPrice: 15100,
    taxPrice: 0,
    shippingPrice: 0, // Livraison gratuite > 10000 XPF
    totalPrice: 15100,
    isPaid: true,
    paidAt: new Date("2024-12-10"),
    isDelivered: true,
    deliveredAt: new Date("2024-12-14"),
    status: "Livrée",
    notes: "Cadeaux de Noël",
  },

  // ==========================================
  // COMMANDE EN PRÉPARATION (payée, non livrée)
  // ==========================================
  {
    userIndex: 2, // Marie Dupont (2ème commande)
    orderItems: [
      {
        name: "Lot Bagues et Perles Artisanales",
        qty: 1,
        image: "/images/lot_bague_perle.jpg",
        price: 2200,
        productIndex: 27,
      },
      {
        name: "Bracelet Tressé Océan",
        qty: 2,
        image: "/images/bracelet_ocean.jpg",
        price: 1500,
        productIndex: 28,
      },
    ],
    shippingAddress: {
      address: "12 Rue de Sébastopol",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-5566778899",
      status: "COMPLETED",
      update_time: "2025-01-15T16:20:00Z",
      email_address: "marie.dupont@email.nc",
    },
    itemsPrice: 5200,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 5700,
    isPaid: true,
    paidAt: new Date("2025-01-15"),
    isDelivered: false,
    deliveredAt: null,
    status: "En préparation",
    notes: "Bijoux à emballer avec soin",
  },

  // ==========================================
  // COMMANDE CONFIRMÉE (payée, en attente)
  // ==========================================
  {
    userIndex: 6, // Léa Watanabe
    orderItems: [
      {
        name: "Cache-pot Blanc Premium",
        qty: 3,
        image: "/images/cache_pot_blanc.jpg",
        price: 2000,
        productIndex: 1,
      },
      {
        name: "Vase Cylindrique Marbré",
        qty: 1,
        image: "/images/vase_marbre.jpg",
        price: 2800,
        productIndex: 7,
      },
    ],
    shippingAddress: {
      address: "56 Rue de Rivoli",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-9988776655",
      status: "COMPLETED",
      update_time: "2025-01-18T11:00:00Z",
      email_address: "lea.watanabe@email.nc",
    },
    itemsPrice: 8800,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 8800,
    isPaid: true,
    paidAt: new Date("2025-01-18"),
    isDelivered: false,
    deliveredAt: null,
    status: "Confirmée",
    notes: "Cliente demande livraison samedi matin",
  },

  // ==========================================
  // COMMANDE EN ATTENTE (non payée - espèces)
  // ==========================================
  {
    userIndex: 5, // Teva Teuru
    orderItems: [
      {
        name: "Lot de 5 Stylos Recyclés",
        qty: 3,
        image: "/images/stylos.webp",
        price: 1500,
        productIndex: 21,
      },
      {
        name: "Pot à Crayons Hexagonal",
        qty: 1,
        image: "/images/pot_crayons.jpg",
        price: 1800,
        productIndex: 23,
      },
    ],
    shippingAddress: {
      address: "23 Rue de Verdun",
      city: "Mont-Dore",
      postalCode: "98809",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Espèces à la livraison",
    paymentResult: null,
    itemsPrice: 6300,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 6800,
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
    status: "En attente",
    notes: "Paiement en espèces prévu à la livraison",
  },

  // ==========================================
  // COMMANDE EXPÉDIÉE (en cours de livraison)
  // ==========================================
  {
    userIndex: 7, // Pierre Leclerc
    orderItems: [
      {
        name: "Dominos Colorés",
        qty: 1,
        image: "/images/dominos.jpg",
        price: 3200,
        productIndex: 18,
      },
      {
        name: "Set Jouets de Plage",
        qty: 2,
        image: "/images/jouets_plage.jpg",
        price: 2800,
        productIndex: 19,
      },
      {
        name: "Toupie Multicolore",
        qty: 4,
        image: "/images/toupie.jpg",
        price: 500,
        productIndex: 20,
      },
    ],
    shippingAddress: {
      address: "78 Boulevard Vauban",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-4455667788",
      status: "COMPLETED",
      update_time: "2025-01-16T08:30:00Z",
      email_address: "pierre.leclerc@gmail.com",
    },
    itemsPrice: 10800,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 10800,
    isPaid: true,
    paidAt: new Date("2025-01-16"),
    isDelivered: false,
    deliveredAt: null,
    status: "Expédiée",
    notes: "Colis en cours de livraison - Tracking: NC123456789",
  },

  // ==========================================
  // COMMANDE ANNULÉE
  // ==========================================
  {
    userIndex: 3, // Jean-Pierre Moana (commande annulée)
    orderItems: [
      {
        name: "Coffret Bien-être",
        qty: 1,
        image: "/images/coffret_bien_etre.jpg",
        price: 4200,
        productIndex: 32,
      },
    ],
    shippingAddress: {
      address: "45 Avenue du Maréchal Foch",
      city: "Dumbéa",
      postalCode: "98835",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: null,
    itemsPrice: 4200,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 4700,
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
    status: "Annulée",
    notes: "Annulée par le client - changement d'avis",
  },

  // ==========================================
  // GROSSE COMMANDE MULTI-ARTICLES
  // ==========================================
  {
    userIndex: 4, // Sophie Martin (2ème commande)
    orderItems: [
      {
        name: "Lunettes de Soleil Noir Classic",
        qty: 1,
        image: "/images/lunettes_noir.webp",
        price: 4800,
        productIndex: 14,
      },
      {
        name: "Porte-clés Tortue",
        qty: 3,
        image: "/images/porte_cles_tortue.jpg",
        price: 800,
        productIndex: 15,
      },
      {
        name: "Collier Pendentif Tortue",
        qty: 1,
        image: "/images/collier_tortue.jpg",
        price: 1800,
        productIndex: 30,
      },
      {
        name: "Boucles d'Oreilles Gouttes",
        qty: 2,
        image: "/images/boucles_gouttes.jpg",
        price: 1200,
        productIndex: 29,
      },
      {
        name: "Coffret Découverte",
        qty: 1,
        image: "/images/coffret_decouverte.jpg",
        price: 5500,
        productIndex: 33,
      },
    ],
    shippingAddress: {
      address: "8 Rue Georges Clémenceau",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-BIGORDER001",
      status: "COMPLETED",
      update_time: "2025-01-19T14:00:00Z",
      email_address: "sophie.martin@gmail.com",
    },
    itemsPrice: 16700,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 16700,
    isPaid: true,
    paidAt: new Date("2025-01-19"),
    isDelivered: false,
    deliveredAt: null,
    status: "Confirmée",
    notes: "Commande importante - vérifier disponibilité de tous les articles",
  },

  // ==========================================
  // COMMANDE AVEC VARIANTES COULEUR
  // ==========================================
  {
    userIndex: 6, // Léa Watanabe (2ème commande)
    orderItems: [
      {
        name: "Peigne Grand Modèle",
        qty: 1,
        image: "/images/peigne_gm.jpg",
        price: 900,
        productIndex: 8,
        variantColor: "Vert océan",
      },
      {
        name: "Peigne Petit Modèle",
        qty: 1,
        image: "/images/peigne_pm.jpg",
        price: 600,
        productIndex: 9,
        variantColor: "Rose corail",
      },
      {
        name: "Porte-savon Minimaliste",
        qty: 2,
        image: "/images/porte_savon.jpg",
        price: 1200,
        productIndex: 11,
        variantColor: "Gris anthracite",
      },
    ],
    shippingAddress: {
      address: "56 Rue de Rivoli",
      city: "Nouméa",
      postalCode: "98800",
      country: "Nouvelle-Calédonie",
    },
    paymentMethod: "Carte bancaire",
    paymentResult: {
      id: "PAY-VARIANT001",
      status: "COMPLETED",
      update_time: "2025-01-20T09:15:00Z",
      email_address: "lea.watanabe@email.nc",
    },
    itemsPrice: 3900,
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 4400,
    isPaid: true,
    paidAt: new Date("2025-01-20"),
    isDelivered: false,
    deliveredAt: null,
    status: "En attente",
    notes: "Vérifier les couleurs spécifiques demandées",
  },
];

export default orders;
