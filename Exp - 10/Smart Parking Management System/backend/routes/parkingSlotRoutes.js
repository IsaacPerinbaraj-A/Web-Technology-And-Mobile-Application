import express from 'express';
import {
  addSlot,
  getSlots,
  getSlot,
  removeSlot,
} from '../controllers/parkingSlotController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/lot/:lotId', getSlots);
router.get('/:slotId', getSlot);

// Admin routes
router.post('/lot/:lotId', authenticate, authorize('admin'), addSlot);
router.delete('/:slotId', authenticate, authorize('admin'), removeSlot);

export default router;
