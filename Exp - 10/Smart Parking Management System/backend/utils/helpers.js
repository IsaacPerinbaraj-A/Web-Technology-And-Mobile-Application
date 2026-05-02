import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import QRCode from 'qrcode';

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const generateBookingId = () => {
  return 'BK-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const generateQRCode = async (bookingId) => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(bookingId);
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const calculateParkingDuration = (entryTime, exitTime) => {
  const start = new Date(entryTime);
  const end = new Date(exitTime);
  const durationMs = end - start;
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.ceil(durationHours);
};

export const calculateParkingCost = (duration, pricePerHour) => {
  return duration * pricePerHour;
};

export const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress
  );
};
