import express from 'express';
import {
  createLot,
  getLots,
  getLot,
  updateLot,
  getLotOccupancyController,
} from '../controllers/parkingLotController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/', getLots);
router.get('/:lotId', getLot);
router.get('/:lotId/occupancy', getLotOccupancyController);

// Admin routes
router.post('/', authenticate, authorize('admin'), createLot);
router.put('/:lotId', authenticate, authorize('admin'), updateLot);

export default router;
