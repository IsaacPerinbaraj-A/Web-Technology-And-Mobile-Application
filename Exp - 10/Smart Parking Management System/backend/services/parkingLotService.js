import ParkingLot from '../models/ParkingLot.js';
import ParkingSlot from '../models/ParkingSlot.js';
import Booking from '../models/Booking.js';
import AuditLog from '../models/AuditLog.js';
import { emitSlotUpdate } from '../config/socket.js';

export const createParkingLot = async (data, userId) => {
  const lot = new ParkingLot({
    ...data,
    availableSlots: data.totalSlots,
    createdBy: userId,
  });

  await lot.save();

  // Automatically create slots
  const slots = [];
  for (let i = 1; i <= data.totalSlots; i++) {
    slots.push({
      lotId: lot._id,
      slotNumber: `${lot.name.substring(0, 1).toUpperCase()}${String(i).padStart(3, '0')}`,
      type: 'regular',
      status: 'AVAILABLE'
    });
  }
  await ParkingSlot.insertMany(slots);

  await AuditLog.create({
    userId,
    actionType: 'LOT_CREATED',
    details: {
      lotId: lot._id,
      name: lot.name,
      totalSlots: lot.totalSlots,
    },
    status: 'SUCCESS',
  });

  return lot;
};

export const getParkingLots = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const lots = await ParkingLot.find().skip(skip).limit(limit);
  const total = await ParkingLot.countDocuments();

  return {
    lots,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getParkingLotById = async (lotId) => {
  return ParkingLot.findById(lotId);
};

export const updateParkingLot = async (lotId, data) => {
  return ParkingLot.findByIdAndUpdate(lotId, data, { new: true });
};

export const getAvailableSlotsCount = async (lotId) => {
  return ParkingSlot.countDocuments({ lotId, status: 'AVAILABLE' });
};

export const getOccupiedSlotsCount = async (lotId) => {
  return ParkingSlot.countDocuments({ lotId, status: 'OCCUPIED' });
};

export const getReservedSlotsCount = async (lotId) => {
  return ParkingSlot.countDocuments({ lotId, status: 'RESERVED' });
};

export const getLotOccupancy = async (lotId) => {
  const lot = await ParkingLot.findById(lotId);
  if (!lot) throw new Error('Parking lot not found');

  const available = await getAvailableSlotsCount(lotId);
  const occupied = await getOccupiedSlotsCount(lotId);
  const reserved = await getReservedSlotsCount(lotId);

  return {
    lotId,
    totalSlots: lot.totalSlots,
    available,
    occupied,
    reserved,
    occupancyPercentage: ((occupied / lot.totalSlots) * 100).toFixed(2),
  };
};
