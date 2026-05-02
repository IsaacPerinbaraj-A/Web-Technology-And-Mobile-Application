import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsersController,
  blockUserController,
  unblockUserController,
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin routes
router.get('/users', authenticate, authorize('admin'), getAllUsersController);
router.put('/users/:userId/block', authenticate, authorize('admin'), blockUserController);
router.put('/users/:userId/unblock', authenticate, authorize('admin'), unblockUserController);

export default router;
