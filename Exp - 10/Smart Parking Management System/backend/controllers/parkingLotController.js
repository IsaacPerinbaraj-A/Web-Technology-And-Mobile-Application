import {
  createParkingLot,
  getParkingLots,
  getParkingLotById,
  updateParkingLot,
  getLotOccupancy,
} from '../services/parkingLotService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createLot = asyncHandler(async (req, res) => {
  const { name, location, address, totalSlots, city, pricePerHour, amenities } = req.body;

  if (!name || !location || !address || !totalSlots || !city) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const lot = await createParkingLot(
    {
      name,
      location,
      address,
      totalSlots,
      city,
      pricePerHour: pricePerHour || 5,
      amenities: amenities || [],
    },
    req.userId
  );

  res.status(201).json({
    success: true,
    message: 'Parking lot created successfully',
    lot,
  });
});

export const getLots = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getParkingLots(page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getLot = asyncHandler(async (req, res) => {
  const { lotId } = req.params;

  const lot = await getParkingLotById(lotId);

  if (!lot) {
    return res.status(404).json({
      success: false,
      message: 'Parking lot not found',
    });
  }

  res.status(200).json({
    success: true,
    lot,
  });
});

export const updateLot = asyncHandler(async (req, res) => {
  const { lotId } = req.params;
  const { name, location, address, city, pricePerHour, amenities } = req.body;

  const lot = await updateParkingLot(lotId, {
    name,
    location,
    address,
    city,
    pricePerHour,
    amenities,
  });

  if (!lot) {
    return res.status(404).json({
      success: false,
      message: 'Parking lot not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Parking lot updated successfully',
    lot,
  });
});

export const getLotOccupancyController = asyncHandler(async (req, res) => {
  const { lotId } = req.params;

  const occupancy = await getLotOccupancy(lotId);

  res.status(200).json({
    success: true,
    occupancy,
  });
});
