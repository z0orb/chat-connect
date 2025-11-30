const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        content:
        {
            type: String,
            required: [true, 'Message content must exist'],
            trim: true
        },

        sender:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        room: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        isEdited:
        {
            type: Boolean,
            default: false
        },

        editedAt:
        {
            type: Date,
            default: null
        }
    },

    { timestamps: true }
);

//kata faiz tambahin biar tambah cepet, query index something
MessageSchema.index({ room: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

module.exports = mongoose.model('Message', MessageSchema);