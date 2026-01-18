import asyncHandler from '../middleware/asyncHandler.js';
import Contact from '../models/contactModel.js';

// @desc    Créer un nouveau message de contact
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const ipAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    ipAddress,
  });

  res.status(201).json(contact);
});

// @desc    Récupérer tous les messages de contact
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    subject,
    isRead,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (subject) filter.subject = subject;
  if (isRead !== undefined) filter.isRead = isRead === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('response.respondedBy', 'name email'),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    contacts,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Récupérer un message de contact par ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).populate(
    'response.respondedBy',
    'name email'
  );

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  res.status(200).json(contact);
});

// @desc    Marquer un message comme lu
// @route   PUT /api/contacts/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  await contact.markAsRead();

  res.status(200).json(contact);
});

// @desc    Mettre à jour le statut d'un message
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  res.status(200).json(contact);
});

// @desc    Répondre à un message
// @route   POST /api/contacts/:id/respond
// @access  Private/Admin
const respondToContact = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  await contact.addResponse(content, req.user._id);

  res.status(200).json(contact);
});

// @desc    Ajouter une note à un message
// @route   PUT /api/contacts/:id/notes
// @access  Private/Admin
const addNotes = asyncHandler(async (req, res) => {
  const { notes } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { notes },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  res.status(200).json(contact);
});

// @desc    Supprimer un message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  await contact.deleteOne();

  res.status(200).json({ message: 'Message supprimé avec succès' });
});

// @desc    Obtenir les statistiques des messages
// @route   GET /api/contacts/stats
// @access  Private/Admin
const getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.getStats();

  res.status(200).json(stats);
});

export {
  createContact,
  getContacts,
  getContact,
  markAsRead,
  updateStatus,
  respondToContact,
  addNotes,
  deleteContact,
  getContactStats,
};