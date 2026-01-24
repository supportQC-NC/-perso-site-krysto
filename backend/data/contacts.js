const contacts = [
  // ==========================================
  // CONTACTS NOUVEAUX (non lus)
  // ==========================================
  {
    name: "Thomas Bernard",
    email: "thomas.bernard@email.nc",
    phone: "687-75-12-34",
    subject: "information",
    message: "Bonjour, je souhaiterais avoir plus d'informations sur vos produits en plastique recyclé. Proposez-vous des ateliers de sensibilisation pour les entreprises ?",
    status: "nouveau",
    isRead: false,
    readAt: null,
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "",
    ipAddress: "203.0.113.45",
  },
  {
    name: "Claire Dubois",
    email: "claire.dubois@gmail.com",
    phone: "687-92-45-67",
    subject: "commande",
    message: "Je n'ai pas reçu ma commande passée il y a 2 semaines. Numéro de commande : #12345. Pouvez-vous me donner des nouvelles ?",
    status: "nouveau",
    isRead: false,
    readAt: null,
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "",
    ipAddress: "203.0.113.67",
  },
  {
    name: "Marc Lefebvre",
    email: "marc.lefebvre@enterprise.nc",
    phone: "687-28-90-12",
    subject: "partenariat",
    message: "Notre entreprise de tourisme éco-responsable serait intéressée par un partenariat. Nous cherchons des cadeaux locaux et durables pour nos clients. Pouvons-nous en discuter ?",
    status: "nouveau",
    isRead: false,
    readAt: null,
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "",
    ipAddress: "203.0.113.89",
  },

  // ==========================================
  // CONTACTS LUS (en attente de traitement)
  // ==========================================
  {
    name: "Julie Mercier",
    email: "julie.mercier@outlook.com",
    phone: "",
    subject: "information",
    message: "Bonjour, vos produits sont-ils garantis ? Quelle est la durée de vie moyenne d'un cache-pot Krysto ?",
    status: "lu",
    isRead: true,
    readAt: new Date("2025-01-15T10:30:00Z"),
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "Question fréquente - préparer une réponse type",
    ipAddress: "203.0.113.101",
  },
  {
    name: "Antoine Rousseau",
    email: "antoine.rousseau@presse.nc",
    phone: "687-45-67-89",
    subject: "presse",
    message: "Journaliste au Nouméa Magazine, je prépare un article sur les initiatives éco-responsables en NC. Seriez-vous disponible pour une interview ?",
    status: "lu",
    isRead: true,
    readAt: new Date("2025-01-16T09:00:00Z"),
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "Opportunité presse intéressante - transmettre à la direction",
    ipAddress: "203.0.113.123",
  },

  // ==========================================
  // CONTACTS EN COURS DE TRAITEMENT
  // ==========================================
  {
    name: "Hôtel Le Méridien",
    email: "achats@lemeridien.nc",
    phone: "687-26-50-00",
    subject: "partenariat",
    message: "Nous cherchons à remplacer nos amenities en plastique par des alternatives durables. Pouvez-vous nous faire une proposition pour 200 chambres ?",
    status: "en_cours",
    isRead: true,
    readAt: new Date("2025-01-10T14:00:00Z"),
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "Devis en préparation - gros potentiel. Contact: Mme Duval, responsable achats.",
    ipAddress: "203.0.113.145",
  },
  {
    name: "Émilie Chen",
    email: "emilie.chen@email.nc",
    phone: "687-78-23-45",
    subject: "commande",
    message: "J'ai reçu ma commande mais un des articles est cassé (sous-verre fissuré). Comment faire pour un échange ?",
    status: "en_cours",
    isRead: true,
    readAt: new Date("2025-01-14T11:30:00Z"),
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "SAV - vérifier commande #67890 et envoyer étiquette retour",
    ipAddress: "203.0.113.167",
  },

  // ==========================================
  // CONTACTS TRAITÉS (avec réponse)
  // ==========================================
  {
    name: "École Sacré-Cœur",
    email: "direction@sacre-coeur.nc",
    phone: "687-27-12-34",
    subject: "partenariat",
    message: "Nous organisons une semaine du développement durable en mars. Seriez-vous intéressés pour animer un atelier sur le recyclage du plastique pour nos élèves de CM2 ?",
    status: "traite",
    isRead: true,
    readAt: new Date("2025-01-05T08:45:00Z"),
    response: {
      content: "Bonjour, nous serions ravis de participer à votre semaine du développement durable ! Nous proposons un atelier interactif de 2h où les enfants découvrent le processus de recyclage et repartent avec un petit objet qu'ils ont fabriqué. Nous vous contacterons par téléphone pour organiser les détails. Cordialement, L'équipe Krysto",
      respondedAt: new Date("2025-01-06T14:00:00Z"),
      respondedBy: null, // Sera remplacé par l'ObjectId admin
    },
    notes: "Atelier confirmé pour le 15 mars 2025 - 2 classes de CM2",
    ipAddress: "203.0.113.189",
  },
  {
    name: "Patricia Nguyen",
    email: "patricia.nguyen@gmail.com",
    phone: "",
    subject: "information",
    message: "Je cherche un cadeau original pour ma sœur qui adore la déco. Que me conseillez-vous dans votre gamme autour de 5000 XPF ?",
    status: "traite",
    isRead: true,
    readAt: new Date("2025-01-08T16:20:00Z"),
    response: {
      content: "Bonjour Patricia, pour un cadeau autour de 5000 XPF, nous vous conseillons notre Coffret Cadeau Noël (4800 XPF) qui comprend 2 sous-verres, 1 porte-clés et 1 bougie artisanale, ou notre Jeu Jenga Recyclé (5500 XPF) pour un cadeau ludique et original. N'hésitez pas à visiter notre boutique ou notre site pour découvrir nos autres créations ! Bien cordialement, L'équipe Krysto",
      respondedAt: new Date("2025-01-09T09:30:00Z"),
      respondedBy: null,
    },
    notes: "",
    ipAddress: "203.0.113.201",
  },
  {
    name: "Association Calédonie Propre",
    email: "contact@caledonie-propre.nc",
    phone: "687-50-60-70",
    subject: "partenariat",
    message: "Nous organisons une grande collecte de bouchons le 22 janvier. Souhaitez-vous participer ou récupérer les bouchons collectés ?",
    status: "traite",
    isRead: true,
    readAt: new Date("2025-01-03T10:00:00Z"),
    response: {
      content: "Bonjour, merci pour cette initiative ! Nous serions enchantés de récupérer les bouchons collectés lors de votre événement. Nous pouvons également tenir un stand pour sensibiliser les participants au recyclage et montrer nos créations. Notre équipe vous recontactera pour organiser la logistique. À bientôt !",
      respondedAt: new Date("2025-01-04T11:15:00Z"),
      respondedBy: null,
    },
    notes: "Partenariat récurrent - collecte mensuelle mise en place",
    ipAddress: "203.0.113.223",
  },

  // ==========================================
  // CONTACTS ARCHIVÉS
  // ==========================================
  {
    name: "Spam Bot",
    email: "spam@suspicious-domain.xyz",
    phone: "",
    subject: "autre",
    message: "Buy cheap watches online! Best prices! Click here: http://scam-link.com",
    status: "archive",
    isRead: true,
    readAt: new Date("2024-12-20T03:00:00Z"),
    response: {
      content: "",
      respondedAt: null,
      respondedBy: null,
    },
    notes: "SPAM - archivé automatiquement",
    ipAddress: "45.33.32.156",
  },
  {
    name: "Pierre Dumont",
    email: "pierre.dumont@ancien-email.nc",
    phone: "687-00-00-00",
    subject: "information",
    message: "Question sur les horaires d'ouverture de la boutique.",
    status: "archive",
    isRead: true,
    readAt: new Date("2024-06-15T14:00:00Z"),
    response: {
      content: "Bonjour, notre boutique est ouverte du mardi au samedi de 9h à 18h. Au plaisir de vous y accueillir !",
      respondedAt: new Date("2024-06-15T16:30:00Z"),
      respondedBy: null,
    },
    notes: "Ancien contact - archivé pour historique",
    ipAddress: "203.0.113.50",
  },
];

export default contacts;
