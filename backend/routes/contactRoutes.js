import express from 'express';
import {
  createContact,
  getContacts,
  getContact,
  markAsRead,
  updateStatus,
  respondToContact,
  addNotes,
  deleteContact,
  getContactStats,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route publique
router.route('/').post(createContact).get(protect, admin, getContacts);

// Routes admin
router.route('/stats').get(protect, admin, getContactStats);
router.route('/:id').get(protect, admin, getContact).delete(protect, admin, deleteContact);
router.route('/:id/read').put(protect, admin, markAsRead);
router.route('/:id/status').put(protect, admin, updateStatus);
router.route('/:id/respond').post(protect, admin, respondToContact);
router.route('/:id/notes').put(protect, admin, addNotes);

export default router;