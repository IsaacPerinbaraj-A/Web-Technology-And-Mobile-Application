import User from '../models/User.js';

export const checkUserBlocked = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by admin',
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
