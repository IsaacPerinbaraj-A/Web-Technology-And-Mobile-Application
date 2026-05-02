import { Server } from 'socket.io';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('🔗 New client connected:', socket.id);

    socket.on('joinLot', (lotId) => {
      socket.join(`lot-${lotId}`);
      console.log(`👤 Client ${socket.id} joined lot ${lotId}`);
    });

    socket.on('leaveLot', (lotId) => {
      socket.leave(`lot-${lotId}`);
      console.log(`👤 Client ${socket.id} left lot ${lotId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

export const emitSlotUpdate = (lotId, slotId, slotData) => {
  if (io) {
    io.to(`lot-${lotId}`).emit('slotUpdated', {
      slotId,
      ...slotData,
    });
  }
};

export const emitBookingCreated = (lotId, bookingData) => {
  if (io) {
    io.to(`lot-${lotId}`).emit('bookingCreated', bookingData);
  }
};

export const emitBookingCancelled = (lotId, bookingId) => {
  if (io) {
    io.to(`lot-${lotId}`).emit('bookingCancelled', { bookingId });
  }
};

export const emitBookingExpired = (lotId, bookingId) => {
  if (io) {
    io.to(`lot-${lotId}`).emit('bookingExpired', { bookingId });
  }
};
