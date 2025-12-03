const Room = require('../models/Room');
const User = require('../models/User');
const RoomMembership = require('../models/RoomMembership');
const Ably = require('ably');

const ably = new Ably.Rest(process.env.ABLY_API_KEY);

//GET semua room
exports.getAllRooms = async (req, res) =>
{
    try {
        const rooms = await Room.find()
          .populate('creator', 'username avatar')
          .populate('members', 'username avatar')
          .sort({ createdAt: -1 });
    
        res.status(200).json({
          message: "Successfully fetched all rooms",
          count: rooms.length,
          data: rooms
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//GET room by room id
exports.getRoomById = async (req, res) =>
{
    try {
        const { rid } = req.params;
    
        const room = await Room.findById(rid)
          .populate('creator', 'username avatar')
          .populate('members', 'username avatar');
    
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        res.status(200).json({
          message: "Successfully fetched room data",
          data: room
        });

      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//CREATE room baru
exports.createRoom = async (req, res) =>
{
    try {
        const { roomName, description, isPrivate } = req.body;
        const creatorId = req.userId; //ini tadi dari middleware jwt
    
        if (!roomName || roomName.trim() === '')
        {
          return res.status(400).json({ error: "Room name must be filled" });
        }
    
        //bikin room baru
        const newRoom = new Room({
          roomName,
          description: description || '',
          isPrivate: isPrivate || false,
          creator: creatorId,
          members: [creatorId],
          memberCount: 1
        });
    
        await newRoom.save();
    
        //create membership si creator
        await RoomMembership.create({
          userId: creatorId,
          roomId: newRoom._id,
          role: 'admin'
        });
    
        //add room ini ke created rooms milik user nya
        await User.findByIdAndUpdate(creatorId, {
          $push: { createdRooms: newRoom._id, joinedRooms: newRoom._id }
        });
    
        const populatedRoom = await newRoom.populate('creator', 'username avatar');
        
        try 
        {
          const creator = await User.findById(creatorId);
          await ably.channels.get(`global:rooms`).publish('room_created', 
            {
            roomId: newRoom._id,
            roomName: newRoom.roomName,
            creatorId: creatorId,
            creatorName: creator.username,
            isPrivate: newRoom.isPrivate
          });
          console.log(`Room created published to global:rooms`);
        } 
        
        catch (ablyErr) 
        {
          console.error('Ably publish error (createRoom):', ablyErr.message);
        }
    
        res.status(201).json({
          message: "Room successfully made",
          data: 
          {
            ...populatedRoom.toObject(),
            roomId: newRoom.roomId
          }
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//UPDATE room info ke db
exports.updateRoom = async (req, res) =>
{
    try {
        const { rid } = req.params;
        const { roomName, description, icon, isPrivate } = req.body;
        const userId = req.userId;
    
        //check if room sudah existing
        const room = await Room.findById(rid);

        if (!room)
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //cek authorization biar member gabisa update karya atmint ygy
        if (room.creator.toString() !== userId) 
        {
          return res.status(403).json({ 
            error: "Only creator can update room" 
          });
        }
    
        //build update object
        const updateData = {};
        if (roomName) updateData.roomName = roomName;
        if (description !== undefined) updateData.description = description;
        if (icon) updateData.icon = icon;
        if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    
        if (Object.keys(updateData).length === 0) 
        {
          return res.status(400).json({ 
            error: "You must update at minimum 1 field" 
          });
        }
    
        const updatedRoom = await Room.findByIdAndUpdate(
          rid,
          updateData,
          { new: true }
        ).populate('creator', 'username avatar')
         .populate('members', 'username avatar');
    
        res.status(200).json({
          message: "Room successfully updated",
          data: updatedRoom
        });

      }

      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//DELETE room by room id
exports.deleteRoomById = async (req, res) =>
{
    try {
        const { rid } = req.params;
        const userId = req.userId;
    
        const room = await Room.findById(rid);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //cek authorization biar ga sembarangan di delete member
        if (room.creator.toString() !== userId) 
        {
          return res.status(403).json({ 
            error: "Only creator can delete room" 
          });
        }
    
        //delete room
        await Room.findByIdAndDelete(rid);
    
        //delete all room membership disini
        await RoomMembership.deleteMany({ roomId: rid });
    
        //remove room ini dari semua user
        await User.updateMany(
          { $or: [{ createdRooms: rid }, { joinedRooms: rid }] },
          { $pull: { createdRooms: rid, joinedRooms: rid } }
        );

        try 
        {
          await ably.channels.get(`rooms:${rid}`).publish('room_deleted', 
            {
            roomId: rid,
            message: 'This room has been deleted by the creator'
          });
          console.log(`Room deletion published to rooms:${rid}`);
        } 
        
        catch (ablyErr) 
        {
          console.error('Ably publish error (deleteRoomById):', ablyErr.message);
        }

    
        res.status(200).json({
          message: "Room successfully deleted"
        });
      }

      catch (err)
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};