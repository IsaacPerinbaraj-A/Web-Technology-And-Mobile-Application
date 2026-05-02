import Booking from '../models/Booking.js';
import ParkingSlot from '../models/ParkingSlot.js';
import ParkingLot from '../models/ParkingLot.js';
import AuditLog from '../models/AuditLog.js';
import { generateBookingId, generateQRCode, calculateParkingDuration, calculateParkingCost } from '../utils/helpers.js';
import { emitBookingCreated, emitBookingCancelled, emitBookingExpired } from '../config/socket.js';
import { reserveSlot, releaseSlot, occupySlot } from './parkingSlotService.js';

export const createBooking = async (userId, slotId, lotId, startTime) => {
  // Use transaction-like logic to prevent double booking
  const session = await Booking.startSession();

  try {
    session.startTransaction();

    // Check slot availability
    const slot = await ParkingSlot.findById(slotId).session(session);
    if (!slot || slot.status !== 'AVAILABLE') {
      throw new Error('Slot is not available');
    }

    // Check lot exists
    const lot = await ParkingLot.findById(lotId).session(session);
    if (!lot) {
      throw new Error('Parking lot not found');
    }

    // Create booking record
    const bookingId = generateBookingId();
    const booking = new Booking({
      userId,
      slotId,
      lotId,
      bookingId,
      startTime: new Date(startTime),
      status: 'RESERVED',
    });

    await booking.save({ session });

    // Reserve the slot
    await ParkingSlot.updateOne(
      { _id: slotId },
      {
        status: 'RESERVED',
        currentUserId: userId,
        currentBookingId: booking._id,
      },
      { session }
    );

    // Update available slots count
    await ParkingLot.updateOne(
      { _id: lotId },
      {
        availableSlots: (lot.availableSlots || lot.totalSlots) - 1,
      },
      { session }
    );

    await session.commitTransaction();

    // Generate QR code
    const qrCode = await generateQRCode(bookingId);
    booking.qrCode = qrCode;
    await booking.save();

    // Log the action
    await AuditLog.create({
      userId,
      actionType: 'BOOKING_CREATED',
      details: {
        bookingId: booking._id,
        slotId,
        lotId,
      },
      status: 'SUCCESS',
    });

    // Emit socket event
    emitBookingCreated(lotId, {
      bookingId: booking._id,
      slotId,
      status: 'RESERVED',
    });

    // Set booking timeout (auto-expire if not confirmed within timeout period)
    const timeoutMinutes = parseInt(process.env.BOOKING_TIMEOUT_MINUTES) || 30;
    setTimeout(() => {
      expireBooking(booking._id).catch(console.error);
    }, timeoutMinutes * 60 * 1000);

    return booking;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getBookingById = async (bookingId) => {
  return Booking.findById(bookingId)
    .populate('userId', 'name email phone')
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name location');
};

export const getBookingByBookingId = async (bookingId) => {
  return Booking.findOne({ bookingId })
    .populate('userId', 'name email phone')
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name location');
};

export const getUserBookings = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const bookings = await Booking.find({ userId })
    .skip(skip)
    .limit(limit)
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name location')
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments({ userId });

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getActiveUserBooking = async (userId) => {
  return Booking.findOne({
    userId,
    status: { $in: ['RESERVED', 'ACTIVE'] },
  })
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name location');
};

export const cancelBooking = async (bookingId, userId, cancellationReason) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId.toString() !== userId.toString() && booking.status !== 'EXPIRED') {
    throw new Error('Not authorized to cancel this booking');
  }

  if (!['RESERVED', 'ACTIVE'].includes(booking.status)) {
    throw new Error(`Cannot cancel a ${booking.status} booking`);
  }

  // Release the slot
  await releaseSlot(booking.slotId, booking.lotId);

  // Update booking status
  booking.status = 'CANCELLED';
  booking.cancellationReason = cancellationReason || 'User cancelled';
  await booking.save();

  // Log the action
  await AuditLog.create({
    userId,
    actionType: 'BOOKING_CANCELLED',
    details: {
      bookingId: booking._id,
      reason: booking.cancellationReason,
    },
    status: 'SUCCESS',
  });

  // Emit socket event
  emitBookingCancelled(booking.lotId, booking._id);

  return booking;
};

export const markEntryTime = async (bookingId, userId) => {
  const booking = await Booking.findOne({ bookingId });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
    throw new Error('Cannot mark entry for this booking');
  }

  booking.entryTime = new Date();
  booking.status = 'ACTIVE';
  await booking.save();

  // Update slot status to OCCUPIED
  await occupySlot(booking.slotId, booking.lotId);

  // Log the action
  await AuditLog.create({
    userId,
    actionType: 'SLOT_ENTRY',
    details: {
      bookingId: booking._id,
      entryTime: booking.entryTime,
    },
    status: 'SUCCESS',
  });

  return booking;
};

export const markExitTime = async (bookingId, userId) => {
  const booking = await Booking.findOne({ bookingId });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status !== 'ACTIVE') {
    throw new Error('Booking is not active');
  }

  booking.exitTime = new Date();
  booking.status = 'COMPLETED';

  // Calculate duration and cost
  const duration = calculateParkingDuration(booking.entryTime, booking.exitTime);
  const lot = await ParkingLot.findById(booking.lotId);
  const totalCost = calculateParkingCost(duration, lot.pricePerHour);

  booking.duration = duration;
  booking.totalCost = totalCost;

  await booking.save();

  // Release the slot
  await releaseSlot(booking.slotId, booking.lotId);

  // Log the action
  await AuditLog.create({
    userId,
    actionType: 'SLOT_EXIT',
    details: {
      bookingId: booking._id,
      exitTime: booking.exitTime,
      duration,
      cost: totalCost,
    },
    status: 'SUCCESS',
  });

  return booking;
};

export const expireBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking || booking.status !== 'RESERVED') {
    return null;
  }

  booking.status = 'EXPIRED';
  await booking.save();

  // Release the slot
  await releaseSlot(booking.slotId, booking.lotId);

  // Emit socket event
  emitBookingExpired(booking.lotId, booking._id);

  return booking;
};

export const getAllBookings = async (page = 1, limit = 10, filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.lotId) {
    query.lotId = filters.lotId;
  }

  const skip = (page - 1) * limit;
  const bookings = await Booking.find(query)
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email phone')
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name location')
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(query);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
