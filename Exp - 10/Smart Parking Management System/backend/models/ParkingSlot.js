import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema(
  {
    lotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true,
    },
    slotNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE'],
      default: 'AVAILABLE',
    },
    type: {
      type: String,
      enum: ['regular', 'handicap', 'compact', 'reserved'],
      default: 'regular',
    },
    currentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    currentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create compound index for lot and slot number uniqueness
parkingSlotSchema.index({ lotId: 1, slotNumber: 1 }, { unique: true });

export default mongoose.model('ParkingSlot', parkingSlotSchema);
