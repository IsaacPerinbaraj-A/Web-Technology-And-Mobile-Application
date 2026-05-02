import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/helpers.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const registerUser = async (name, email, password, role = 'user') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();

  await AuditLog.create({
    userId: user._id,
    actionType: 'USER_REGISTERED',
    details: { email, role },
    status: 'SUCCESS',
  });

  return user;
};

export const loginUser = async (email, password, ipAddress) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    await AuditLog.create({
      actionType: 'USER_LOGIN',
      details: { email },
      ipAddress,
      status: 'FAILED',
    });
    throw new Error('Invalid credentials');
  }

  if (user.isBlocked) {
    throw new Error('Your account has been blocked by admin');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    await AuditLog.create({
      userId: user._id,
      actionType: 'USER_LOGIN',
      details: { email },
      ipAddress,
      status: 'FAILED',
    });
    throw new Error('Invalid credentials');
  }

  await AuditLog.create({
    userId: user._id,
    actionType: 'USER_LOGIN',
    details: { email },
    ipAddress,
    status: 'SUCCESS',
  });

  const token = generateToken(user._id, user.role);
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getUserById = async (userId) => {
  return User.findById(userId);
};

export const updateUserProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
  });
  return user;
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit);
  const total = await User.countDocuments();

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const blockUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
  return user;
};

export const unblockUser = async (userId) => {
  const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
  return user;
};
