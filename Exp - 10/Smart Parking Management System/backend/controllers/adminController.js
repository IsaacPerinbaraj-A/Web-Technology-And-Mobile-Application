import { asyncHandler } from '../middleware/errorHandler.js';
import { getAllBookings } from '../services/bookingService.js';
import { getAllUsers } from '../services/authService.js';
import ParkingLot from '../models/ParkingLot.js';
import Booking from '../models/Booking.js';
import AuditLog from '../models/AuditLog.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await Booking.countDocuments({ status: 'COMPLETED' });
  const totalLots = await ParkingLot.countDocuments();
  const activeBookings = await Booking.countDocuments({ status: 'ACTIVE' });
  const totalRevenue = await Booking.aggregate([
    { $match: { status: 'COMPLETED' } },
    { $group: { _id: null, total: { $sum: '$totalCost' } } },
  ]);

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name email')
    .populate('slotId', 'slotNumber')
    .populate('lotId', 'name');

  res.status(200).json({
    success: true,
    stats: {
      totalLots,
      activeBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      completedBookings: totalUsers,
    },
    recentBookings,
  });
});

export const getAllUsersAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getAllUsers(page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getAllBookings(page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getRevenueReport = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ status: 'COMPLETED' })
    .populate('lotId', 'name')
    .sort({ exitTime: -1 });

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalCost, 0);

  const revenueByLot = {};
  bookings.forEach((booking) => {
    const lotName = booking.lotId.name;
    revenueByLot[lotName] = (revenueByLot[lotName] || 0) + booking.totalCost;
  });

  res.status(200).json({
    success: true,
    totalRevenue,
    revenueByLot,
    completedBookings: bookings.length,
  });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const skip = (page - 1) * limit;
  const logs = await AuditLog.find()
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  const total = await AuditLog.countDocuments();

  res.status(200).json({
    success: true,
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});
