const subUniverses = [
  // ==========================================
  // MAISON & DÉCO
  // ==========================================
  {
    name: "Décoration intérieure",
    description: "Objets décoratifs uniques pour embellir votre intérieur avec style et conscience écologique.",
    image: "/images/subuniverses/decoration-interieure.jpg",
    universeName: "Maison & Déco",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Plantes & Jardin",
    description: "Cache-pots, vases et accessoires pour vos plantes d'intérieur et votre jardin.",
    image: "/images/subuniverses/plantes-jardin.jpg",
    universeName: "Maison & Déco",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Arts de la table",
    description: "Sous-verres, dessous de plat et accessoires pour une table éco-responsable.",
    image: "/images/subuniverses/arts-table.jpg",
    universeName: "Maison & Déco",
    isActive: true,
    displayOrder: 3,
  },
  {
    name: "Rangement",
    description: "Boîtes, paniers et solutions de rangement en plastique recyclé.",
    image: "/images/subuniverses/rangement.jpg",
    universeName: "Maison & Déco",
    isActive: false, // Inactif pour test
    displayOrder: 4,
  },

  // ==========================================
  // SALLE DE BAIN
  // ==========================================
  {
    name: "Soins capillaires",
    description: "Peignes et accessoires pour prendre soin de vos cheveux naturellement.",
    image: "/images/subuniverses/soins-capillaires.jpg",
    universeName: "Salle de bain",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Accessoires de bain",
    description: "Porte-savons, gobelets et organisateurs pour une salle de bain zéro déchet.",
    image: "/images/subuniverses/accessoires-bain.jpg",
    universeName: "Salle de bain",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Hygiène",
    description: "Accessoires d'hygiène quotidienne éco-responsables.",
    image: "/images/subuniverses/hygiene.jpg",
    universeName: "Salle de bain",
    isActive: false, // Inactif pour test
    displayOrder: 3,
  },

  // ==========================================
  // ACCESSOIRES MODE
  // ==========================================
  {
    name: "Lunetterie",
    description: "Montures de lunettes de soleil stylées et éco-responsables.",
    image: "/images/subuniverses/lunetterie.jpg",
    universeName: "Accessoires Mode",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Petite maroquinerie",
    description: "Porte-clés, coques de téléphone et petits accessoires du quotidien.",
    image: "/images/subuniverses/petite-maroquinerie.jpg",
    universeName: "Accessoires Mode",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Sacs & Pochettes",
    description: "Sacs à main et pochettes en matériaux recyclés.",
    image: "/images/subuniverses/sacs-pochettes.jpg",
    universeName: "Accessoires Mode",
    isActive: false, // Inactif pour test
    displayOrder: 3,
  },

  // ==========================================
  // JEUX & LOISIRS
  // ==========================================
  {
    name: "Jeux de société",
    description: "Jeux classiques revisités en version durable pour toute la famille.",
    image: "/images/subuniverses/jeux-societe.jpg",
    universeName: "Jeux & Loisirs",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Jouets enfants",
    description: "Jouets sûrs et durables pour les petits aventuriers.",
    image: "/images/subuniverses/jouets-enfants.jpg",
    universeName: "Jeux & Loisirs",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Activités créatives",
    description: "Kits et accessoires pour les loisirs créatifs.",
    image: "/images/subuniverses/activites-creatives.jpg",
    universeName: "Jeux & Loisirs",
    isActive: true,
    displayOrder: 3,
  },

  // ==========================================
  // BUREAU
  // ==========================================
  {
    name: "Écriture",
    description: "Stylos, crayons et accessoires d'écriture écologiques.",
    image: "/images/subuniverses/ecriture.jpg",
    universeName: "Bureau",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Organisation",
    description: "Pots à crayons, rangements et accessoires pour un bureau bien organisé.",
    image: "/images/subuniverses/organisation.jpg",
    universeName: "Bureau",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Fournitures scolaires",
    description: "Règles, trousses et accessoires pour l'école.",
    image: "/images/subuniverses/fournitures-scolaires.jpg",
    universeName: "Bureau",
    isActive: true,
    displayOrder: 3,
  },

  // ==========================================
  // BIJOUX
  // ==========================================
  {
    name: "Bagues & Bracelets",
    description: "Bagues et bracelets uniques aux couleurs vives et naturelles.",
    image: "/images/subuniverses/bagues-bracelets.jpg",
    universeName: "Bijoux",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Colliers & Boucles d'oreilles",
    description: "Colliers et boucles d'oreilles artisanales pour un style unique.",
    image: "/images/subuniverses/colliers-boucles.jpg",
    universeName: "Bijoux",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Bijoux Homme",
    description: "Bracelets et accessoires pour homme en matériaux recyclés.",
    image: "/images/subuniverses/bijoux-homme.jpg",
    universeName: "Bijoux",
    isActive: true,
    displayOrder: 3,
  },

  // ==========================================
  // COFFRETS CADEAUX
  // ==========================================
  {
    name: "Coffrets thématiques",
    description: "Coffrets cadeaux composés autour de thèmes spécifiques.",
    image: "/images/subuniverses/coffrets-thematiques.jpg",
    universeName: "Coffrets Cadeaux",
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Coffrets personnalisés",
    description: "Créez votre coffret sur mesure avec vos produits préférés.",
    image: "/images/subuniverses/coffrets-personnalises.jpg",
    universeName: "Coffrets Cadeaux",
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Coffrets Entreprise",
    description: "Cadeaux d'entreprise éco-responsables personnalisables.",
    image: "/images/subuniverses/coffrets-entreprise.jpg",
    universeName: "Coffrets Cadeaux",
    isActive: true,
    displayOrder: 3,
  },

  // ==========================================
  // COLLECTION LIMITÉE (univers inactif)
  // ==========================================
  {
    name: "Collaborations Artistes",
    description: "Créations en partenariat avec des artistes locaux.",
    image: "/images/subuniverses/collaborations-artistes.jpg",
    universeName: "Collection Limitée",
    isActive: true,
    displayOrder: 1,
  },

  // ==========================================
  // MOBILIER (univers inactif)
  // ==========================================
  {
    name: "Petits meubles",
    description: "Tables basses, tabourets et petits meubles d'appoint.",
    image: "/images/subuniverses/petits-meubles.jpg",
    universeName: "Mobilier",
    isActive: true,
    displayOrder: 1,
  },
];

export default subUniverses;
