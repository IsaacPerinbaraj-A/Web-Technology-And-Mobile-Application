import ParkingSlot from '../models/ParkingSlot.js';
import ParkingLot from '../models/ParkingLot.js';
import AuditLog from '../models/AuditLog.js';
import { emitSlotUpdate } from '../config/socket.js';

export const createParkingSlot = async (lotId, slotNumber, type = 'regular', userId) => {
  const lot = await ParkingLot.findById(lotId);
  if (!lot) {
    throw new Error('Parking lot not found');
  }

  const existingSlot = await ParkingSlot.findOne({ lotId, slotNumber });
  if (existingSlot) {
    throw new Error('Slot already exists for this lot');
  }

  const slot = new ParkingSlot({
    lotId,
    slotNumber,
    type,
  });

  await slot.save();

  // Update lot's total slots
  lot.totalSlots += 1;
  lot.availableSlots += 1;
  await lot.save();

  await AuditLog.create({
    userId,
    actionType: 'SLOT_ADDED',
    details: {
      lotId,
      slotNumber,
      type,
    },
    status: 'SUCCESS',
  });

  return slot;
};

export const getParkingSlots = async (lotId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const slots = await ParkingSlot.find({ lotId })
    .skip(skip)
    .limit(limit)
    .populate('currentUserId', 'name email');
  const total = await ParkingSlot.countDocuments({ lotId });

  return {
    slots,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getSlotById = async (slotId) => {
  return ParkingSlot.findById(slotId).populate('currentUserId', 'name email');
};

export const updateSlotStatus = async (slotId, status, userId = null, bookingId = null, lotId = null) => {
  const slot = await ParkingSlot.findByIdAndUpdate(
    slotId,
    {
      status,
      currentUserId: userId,
      currentBookingId: bookingId,
      lastUpdated: new Date(),
    },
    { new: true }
  );

  if (lotId) {
    emitSlotUpdate(lotId, slotId, {
      status,
      slotNumber: slot.slotNumber,
    });
  }

  return slot;
};

export const reserveSlot = async (slotId, userId, bookingId, lotId) => {
  const slot = await ParkingSlot.findById(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.status !== 'AVAILABLE') {
    throw new Error(`Slot is not available. Current status: ${slot.status}`);
  }

  // Update slot status to RESERVED
  return updateSlotStatus(slotId, 'RESERVED', userId, bookingId, lotId);
};

export const occupySlot = async (slotId, lotId) => {
  return updateSlotStatus(slotId, 'OCCUPIED', null, null, lotId);
};

export const releaseSlot = async (slotId, lotId) => {
  const slot = await updateSlotStatus(slotId, 'AVAILABLE', null, null, lotId);

  // Update parking lot available slots count
  const lot = await ParkingLot.findById(lotId);
  if (lot) {
    lot.availableSlots = await ParkingSlot.countDocuments({
      lotId,
      status: 'AVAILABLE',
    });
    await lot.save();
  }

  return slot;
};

export const deleteSlot = async (slotId, lotId, userId) => {
  const slot = await ParkingSlot.findById(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.status === 'OCCUPIED' || slot.status === 'RESERVED') {
    throw new Error('Cannot delete an occupied or reserved slot');
  }

  await ParkingSlot.findByIdAndDelete(slotId);

  // Update lot's total slots
  const lot = await ParkingLot.findById(lotId);
  if (lot) {
    lot.totalSlots -= 1;
    lot.availableSlots -= 1;
    await lot.save();
  }

  await AuditLog.create({
    userId,
    actionType: 'SLOT_UPDATED',
    details: {
      action: 'DELETE',
      slotId,
      slotNumber: slot.slotNumber,
    },
    status: 'SUCCESS',
  });

  return slot;
};
