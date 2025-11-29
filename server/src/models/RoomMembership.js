const mongoose = require("mongoose");

const RoomMembershipSchema = new mongoose.Schema(
    {
        userId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        roomId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        joinedAt:
        {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("RoomMembership", RoomMembershipSchema);