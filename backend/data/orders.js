// Note: Les champs 'user' et 'product' seront remplacés par les vrais ObjectIds dans le seeder
// userIndex: correspond à l'index dans le tableau users (0 = admin, 1 = marie, etc.)
// productIndex: correspond à l'index dans le tableau products

const orders = [
  {
    userIndex: 1, // Marie Dupont
    orderItems: [
      {
        name: "Cache-pot Marbré",
        qty: 2,
        image: "/images/cache_pot.jpg",
        price: 1800,
        productIndex: 0,
      },
      {
        name: "Lot de 4 Sous-verres",
        qty: 1,
        image: "/images/sous_verre.jpg",
        price: 1200,
        productIndex: 1,
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
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 5300, // (1800 * 2) + 1200 + 500
    isPaid: true,
    paidAt: new Date("2024-10-15"),
    isDelivered: true,
    deliveredAt: new Date("2024-10-18"),
  },
  {
    userIndex: 2, // Jean-Pierre Moana
    orderItems: [
      {
        name: "Lunettes de Soleil Coral",
        qty: 1,
        image: "/images/lunettes.webp",
        price: 4500,
        productIndex: 4,
      },
      {
        name: "Peigne Grand Modèle",
        qty: 2,
        image: "/images/peigne_gm.jpg",
        price: 900,
        productIndex: 2,
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
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 6800, // 4500 + (900 * 2) + 500
    isPaid: true,
    paidAt: new Date("2024-11-02"),
    isDelivered: true,
    deliveredAt: new Date("2024-11-05"),
  },
  {
    userIndex: 3, // Sophie Martin
    orderItems: [
      {
        name: "Jeu Jenga Recyclé",
        qty: 1,
        image: "/images/jenga.jpg",
        price: 5500,
        productIndex: 5,
      },
      {
        name: "Coffret Cadeau Noël",
        qty: 2,
        image: "/images/pack_noel.jpg",
        price: 4800,
        productIndex: 9,
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
    taxPrice: 0,
    shippingPrice: 0, // Livraison gratuite > 10000 XPF
    totalPrice: 15100, // 5500 + (4800 * 2)
    isPaid: true,
    paidAt: new Date("2024-12-10"),
    isDelivered: false,
    deliveredAt: null,
  },
  {
    userIndex: 1, // Marie Dupont (2ème commande)
    orderItems: [
      {
        name: "Bagues et Perles Artisanales",
        qty: 1,
        image: "/images/lot_bague_perle.jpg",
        price: 2200,
        productIndex: 7,
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
      update_time: "2024-12-20T16:20:00Z",
      email_address: "marie.dupont@email.nc",
    },
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 2700,
    isPaid: true,
    paidAt: new Date("2024-12-20"),
    isDelivered: true,
    deliveredAt: new Date("2024-12-23"),
  },
  {
    userIndex: 4, // Teva Teuru
    orderItems: [
      {
        name: "Lot de 5 Stylos",
        qty: 3,
        image: "/images/stylos.webp",
        price: 1500,
        productIndex: 6,
      },
      {
        name: "Cache-pot Blanc Premium",
        qty: 1,
        image: "/images/cache_pot_blanc.jpg",
        price: 2000,
        productIndex: 8,
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
    taxPrice: 0,
    shippingPrice: 500,
    totalPrice: 7000, // (1500 * 3) + 2000 + 500
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null,
  },
];

export default orders;