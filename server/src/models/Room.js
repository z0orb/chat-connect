const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        roomName:
        {
            type: String,
            required: [true, 'Room name must be filled'],
            trim: true,
            minlength: [3, 'Room name must be atleast 3 characters']
        },

        description:
        {
            type: String,
            default: '',
            maxlength: [500, 'Description must be less or equal than 500 characters']
        },

        roomId:
        {
            type: String,
            unique: true,
            index: true
        },

        creator:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        members:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        icon:
        {
            type: String,
            default: 'https://via.placeholder.com/150'
        },

        isPrivate:
        {
            type: Boolean,
            default: false
        },

        memberCount:
        {
            type: Number,
            default: 1
        }
    },

    { timestamps: true }
);

// Generate unique room id sebelum disave
RoomSchema.pre('save', function () 
{
    if (!this.roomId) {
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      this.roomId = `ROOM_${randomId}_${Date.now()}`;
    }
});

module.exports = mongoose.model('Room', RoomSchema);