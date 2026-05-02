import {
  createParkingSlot,
  getParkingSlots,
  getSlotById,
  deleteSlot,
} from '../services/parkingSlotService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const addSlot = asyncHandler(async (req, res) => {
  const { lotId } = req.params;
  const { slotNumber, type } = req.body;

  if (!slotNumber || !lotId) {
    return res.status(400).json({
      success: false,
      message: 'Lot ID and slot number are required',
    });
  }

  const slot = await createParkingSlot(lotId, slotNumber, type || 'regular', req.userId);

  res.status(201).json({
    success: true,
    message: 'Parking slot created successfully',
    slot,
  });
});

export const getSlots = asyncHandler(async (req, res) => {
  const { lotId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const result = await getParkingSlots(lotId, page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const slot = await getSlotById(slotId);

  if (!slot) {
    return res.status(404).json({
      success: false,
      message: 'Slot not found',
    });
  }

  res.status(200).json({
    success: true,
    slot,
  });
});

export const removeSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const { lotId } = req.body;

  if (!lotId) {
    return res.status(400).json({
      success: false,
      message: 'Lot ID is required',
    });
  }

  const slot = await deleteSlot(slotId, lotId, req.userId);

  res.status(200).json({
    success: true,
    message: 'Slot deleted successfully',
    slot,
  });
});
