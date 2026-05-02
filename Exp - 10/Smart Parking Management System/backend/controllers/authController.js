import {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  getAllUsers,
  blockUser,
  unblockUser,
} from '../services/authService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getClientIp } from '../utils/helpers.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required',
    });
  }

  const user = await registerUser(name, email, password, role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const ipAddress = getClientIp(req);
  const result = await loginUser(email, password, ipAddress);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: result.user,
    token: result.token,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, vehicleNumber } = req.body;

  const user = await updateUserProfile(req.userId, {
    name,
    phone,
    vehicleNumber,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

export const getAllUsersController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await getAllUsers(page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const blockUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await blockUser(userId);

  res.status(200).json({
    success: true,
    message: 'User blocked successfully',
    user,
  });
});

export const unblockUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await unblockUser(userId);

  res.status(200).json({
    success: true,
    message: 'User unblocked successfully',
    user,
  });
});
