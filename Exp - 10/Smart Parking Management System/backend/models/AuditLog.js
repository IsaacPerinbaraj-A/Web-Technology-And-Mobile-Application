import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTERED',
        'USER_LOGIN',
        'BOOKING_CREATED',
        'BOOKING_CANCELLED',
        'BOOKING_COMPLETED',
        'SLOT_ENTRY',
        'SLOT_EXIT',
        'SLOT_UPDATED',
        'LOT_CREATED',
        'SLOT_ADDED',
        'USER_BLOCKED',
        'USER_UNBLOCKED',
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

export default mongoose.model('AuditLog', auditLogSchema);
