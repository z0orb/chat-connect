const mongoose = require('mongoose');

const RoomMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    roomId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },

    role: 
    {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },

    status: 
    {
      type: String,
      enum: ['active', 'muted', 'suspended'],
      default: 'active'
    },

    joinedAt: 
    {
      type: Date,
      default: Date.now
    }
  },

  { timestamps: true }
);

//Biar membership gk duplikat
RoomMembershipSchema.index({ userId: 1, roomId: 1 }, { unique: true });

module.exports = mongoose.model('RoomMembership', RoomMembershipSchema);
