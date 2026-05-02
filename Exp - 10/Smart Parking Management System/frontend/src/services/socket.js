import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const joinLot = (lotId) => {
  const socket = getSocket();
  socket.emit('joinLot', lotId);
};

export const leaveLot = (lotId) => {
  const socket = getSocket();
  socket.emit('leaveLot', lotId);
};

export const onSlotUpdated = (callback) => {
  const socket = getSocket();
  socket.on('slotUpdated', callback);
};

export const onBookingCreated = (callback) => {
  const socket = getSocket();
  socket.on('bookingCreated', callback);
};

export const onBookingCancelled = (callback) => {
  const socket = getSocket();
  socket.on('bookingCancelled', callback);
};

export const onBookingExpired = (callback) => {
  const socket = getSocket();
  socket.on('bookingExpired', callback);
};

export const offSlotUpdated = (callback) => {
  const socket = getSocket();
  socket.off('slotUpdated', callback);
};

export const offBookingCreated = (callback) => {
  const socket = getSocket();
  socket.off('bookingCreated', callback);
};

export const offBookingCancelled = (callback) => {
  const socket = getSocket();
  socket.off('bookingCancelled', callback);
};

export const offBookingExpired = (callback) => {
  const socket = getSocket();
  socket.off('bookingExpired', callback);
};
