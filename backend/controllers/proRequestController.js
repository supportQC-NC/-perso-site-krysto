import asyncHandler from "../middleware/asyncHandler.js";
import ProRequest from "../models/proRequestModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { proRequestNotificationTemplate, proRequestApprovedTemplate, proRequestRejectedTemplate } from "../utils/proEmailTemplates.js";

// ==========================================
// ROUTES UTILISATEUR (AUTHENTIFIÉ)
// ==========================================

// @desc    Créer une demande de compte Pro
// @route   POST /api/pro-requests
// @access  Private
const createProRequest = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    legalStatus,
    ridetNumber,
    address,
    partnershipType,
    message,
  } = req.body;

  // Vérifier si l'utilisateur est déjà Pro
  const user = await User.findById(req.user._id);
  if (user.isPro) {
    res.status(400);
    throw new Error("Vous avez déjà un compte professionnel");
  }

  // Vérifier si une demande est déjà en cours
  const existingRequest = await ProRequest.findOne({
    user: req.user._id,
    status: "pending",
  });

  if (existingRequest) {
    res.status(400);
    throw new Error("Vous avez déjà une demande en cours de traitement");
  }

  // Créer la demande
  const proRequest = await ProRequest.create({
    user: req.user._id,
    firstName,
    lastName,
    email,
    phone,
    companyName,
    legalStatus,
    ridetNumber,
    address,
    partnershipType,
    message,
  });

  // Mettre à jour le statut de l'utilisateur
  user.proStatus = "pending";
  await user.save();

  // Envoyer une notification aux admins
  try {
    const admins = await User.find({ isAdmin: true }).select("email");
    const adminEmails = admins.map((admin) => admin.email);

    if (adminEmails.length > 0) {
      await sendEmail({
        email: adminEmails.join(","),
        subject: `🏢 Nouvelle demande de compte Pro - ${companyName}`,
        html: proRequestNotificationTemplate(proRequest),
      });
    }
  } catch (error) {
    console.error("Erreur envoi email notification admin:", error);
  }

  res.status(201).json({
    message: "Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.",
    proRequest,
  });
});

// @desc    Obtenir mes demandes Pro
// @route   GET /api/pro-requests/my-requests
// @access  Private
const getMyProRequests = asyncHandler(async (req, res) => {
  const proRequests = await ProRequest.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(proRequests);
});

// @desc    Annuler ma demande en cours
// @route   PUT /api/pro-requests/:id/cancel
// @access  Private
const cancelMyProRequest = asyncHandler(async (req, res) => {
  const proRequest = await ProRequest.findById(req.params.id);

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  // Vérifier que c'est bien la demande de l'utilisateur
  if (proRequest.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Non autorisé");
  }

  // Vérifier que la demande est en attente
  if (proRequest.status !== "pending") {
    res.status(400);
    throw new Error("Seules les demandes en attente peuvent être annulées");
  }

  proRequest.status = "cancelled";
  await proRequest.save();

  // Mettre à jour le statut de l'utilisateur
  const user = await User.findById(req.user._id);
  user.proStatus = "none";
  await user.save();

  res.status(200).json({
    message: "Votre demande a été annulée",
    proRequest,
  });
});

// ==========================================
// ROUTES ADMIN
// ==========================================

// @desc    Obtenir toutes les demandes Pro
// @route   GET /api/pro-requests
// @access  Private/Admin
const getProRequests = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    partnershipType,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (partnershipType) filter.partnershipType = partnershipType;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [proRequests, total] = await Promise.all([
    ProRequest.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email")
      .populate("processedBy", "name email"),
    ProRequest.countDocuments(filter),
  ]);

  res.status(200).json({
    proRequests,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

// @desc    Obtenir une demande Pro par ID
// @route   GET /api/pro-requests/:id
// @access  Private/Admin
const getProRequestById = asyncHandler(async (req, res) => {
  const proRequest = await ProRequest.findById(req.params.id)
    .populate("user", "name email createdAt")
    .populate("processedBy", "name email");

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  res.status(200).json(proRequest);
});

// @desc    Approuver une demande Pro
// @route   PUT /api/pro-requests/:id/approve
// @access  Private/Admin
const approveProRequest = asyncHandler(async (req, res) => {
  const { discountRate, adminNotes } = req.body;

  const proRequest = await ProRequest.findById(req.params.id);

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (proRequest.status !== "pending") {
    res.status(400);
    throw new Error("Cette demande a déjà été traitée");
  }

  // Approuver la demande
  await proRequest.approve(req.user._id);

  // Mettre à jour l'utilisateur en Pro
  const user = await User.findById(proRequest.user);
  await user.setAsPro(
    {
      companyName: proRequest.companyName,
      legalStatus: proRequest.legalStatus,
      ridetNumber: proRequest.ridetNumber,
      partnershipType: proRequest.partnershipType,
      address: proRequest.address,
      phone: proRequest.phone,
      email: proRequest.email,
      firstName: proRequest.firstName,
      lastName: proRequest.lastName,
      discountRate: discountRate || 0,
      adminNotes: adminNotes || "",
    },
    req.user._id
  );

  // Envoyer un email de confirmation à l'utilisateur
  try {
    await sendEmail({
      email: proRequest.email,
      subject: "🎉 Votre compte Pro Krysto a été approuvé !",
      html: proRequestApprovedTemplate(proRequest, user),
    });
  } catch (error) {
    console.error("Erreur envoi email approbation:", error);
  }

  res.status(200).json({
    message: "Demande approuvée avec succès",
    proRequest,
  });
});

// @desc    Rejeter une demande Pro
// @route   PUT /api/pro-requests/:id/reject
// @access  Private/Admin
const rejectProRequest = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const proRequest = await ProRequest.findById(req.params.id);

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (proRequest.status !== "pending") {
    res.status(400);
    throw new Error("Cette demande a déjà été traitée");
  }

  // Rejeter la demande
  await proRequest.reject(req.user._id, rejectionReason);

  // Mettre à jour le statut de l'utilisateur
  const user = await User.findById(proRequest.user);
  user.proStatus = "none";
  await user.save();

  // Envoyer un email de notification à l'utilisateur
  try {
    await sendEmail({
      email: proRequest.email,
      subject: "Concernant votre demande de compte Pro Krysto",
      html: proRequestRejectedTemplate(proRequest, rejectionReason),
    });
  } catch (error) {
    console.error("Erreur envoi email refus:", error);
  }

  res.status(200).json({
    message: "Demande rejetée",
    proRequest,
  });
});

// @desc    Ajouter des notes admin à une demande
// @route   PUT /api/pro-requests/:id/notes
// @access  Private/Admin
const addAdminNotes = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;

  const proRequest = await ProRequest.findByIdAndUpdate(
    req.params.id,
    { adminNotes },
    { new: true, runValidators: true }
  );

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  res.status(200).json(proRequest);
});

// @desc    Supprimer une demande Pro
// @route   DELETE /api/pro-requests/:id
// @access  Private/Admin
const deleteProRequest = asyncHandler(async (req, res) => {
  const proRequest = await ProRequest.findById(req.params.id);

  if (!proRequest) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  await proRequest.deleteOne();

  res.status(200).json({ message: "Demande supprimée avec succès" });
});

// @desc    Obtenir les statistiques des demandes Pro
// @route   GET /api/pro-requests/stats
// @access  Private/Admin
const getProRequestStats = asyncHandler(async (req, res) => {
  const stats = await ProRequest.getStats();
  const userProStats = await User.getProStats();

  res.status(200).json({
    requests: stats,
    users: userProStats,
  });
});

export {
  // User routes
  createProRequest,
  getMyProRequests,
  cancelMyProRequest,
  // Admin routes
  getProRequests,
  getProRequestById,
  approveProRequest,
  rejectProRequest,
  addAdminNotes,
  deleteProRequest,
  getProRequestStats,
};