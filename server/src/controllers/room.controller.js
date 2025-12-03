const Room = require('../models/Room');
const User = require('../models/User');
const RoomMembership = require('../models/RoomMembership');
const Ably = require('ably');

const ably = new Ably.Rest(process.env.ABLY_API_KEY);

//GET semua room
exports.getAllRooms = async (req, res) =>
{
    try 
    {
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
    
        //regex custom roomId dulu baru ._id kalo gaada
        let room;
        if (rid.match(/^[0-9a-fA-F]{24}$/)) 
        {
          room = await Room.findOne({ 
            $or: [{ roomId: rid }, { _id: rid }] 
          });
        } 

        else 
        {
          room = await Room.findOne({ roomId: rid });
        }
        
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
        
        // Populate after finding
        await room.populate('creator', 'username avatar');
        await room.populate('members', 'username avatar');
    
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
            roomId: newRoom.roomId,  // Use custom roomId for Ably event
            _id: newRoom._id,
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
          data: populatedRoom
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
    
        let room;
        if (rid.match(/^[0-9a-fA-F]{24}$/)) 
        {
          room = await Room.findOne({ 
            $or: [{ roomId: rid }, { _id: rid }] 
          });
        } 
        
        else 
        {
          room = await Room.findOne({ roomId: rid });
        }

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
          room._id,  // Use the MongoDB _id from the found room
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
    
        let room;
        if (rid.match(/^[0-9a-fA-F]{24}$/)) 
        {
          room = await Room.findOne({ 
            $or: [{ roomId: rid }, { _id: rid }] 
          });
        } 
        
        else 
        {
          room = await Room.findOne({ roomId: rid });
        }
        
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
    
        //delete room - use MongoDB _id
        await Room.findByIdAndDelete(room._id);
    
        //delete all room membership disini
        await RoomMembership.deleteMany({ roomId: room._id });
    
        //remove room ini dari semua user
        await User.updateMany(
          { $or: [{ createdRooms: room._id }, { joinedRooms: room._id }] },
          { $pull: { createdRooms: room._id, joinedRooms: room._id } }
        );

        try 
        {
          await ably.channels.get(`rooms:${room._id}`).publish('room_deleted', 
            {
            roomId: room.roomId,  // Send custom roomId
            _id: room._id,
            message: 'This room has been deleted by the creator'
          });
          console.log(`Room deletion published to rooms:${room._id}`);
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