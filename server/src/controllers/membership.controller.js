const RoomMembership = require('../models/RoomMembership');
const Room = require('../models/Room');
const User = require('../models/User');

//GET semua anggota room
exports.getAllMembers = async (req, res) => 
{
    try 
    {
        const { rid } = req.params;
    
        //check if roomnya existing dulu
        const room = await Room.findById(rid);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        const members = await RoomMembership.find({ roomId: rid })
          .populate('userId', 'username avatar bio')
          .sort({ joinedAt: -1 });
    
        res.status(200).json({
          message: "Successfully fetched all members",
          count: members.length,
          data: members
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//GET user dalam room by id
exports.getMemberById = async (req, res) => 
{
    try 
    {
        const { rid, uid } = req.params;
    
        const member = await RoomMembership.findOne({ 
          roomId: rid, 
          userId: uid 
        }).populate('userId', 'username avatar bio');
    
        if (!member) 
        {
          return res.status(404).json({ 
            error: "Member not found in this room" 
          });
        }
    
        res.status(200).json({
          message: "Successfully fetched member data",
          data: member
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//CREATE add user ke dalam room / create membership status
exports.addMember = async (req, res) => 
{
    try 
    {
        const { userId, roomId } = req.body;
    
        if (!userId || !roomId) 
        {
          return res.status(400).json({ 
            error: "User ID and room must be filled"
          });
        }
    
        //chekc user exist / tidak
        const user = await User.findById(userId);
        if (!user) 
        {
          return res.status(404).json({ error: "User not found" });
        }
    
        //check if room ada
        const room = await Room.findById(roomId);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //check if user == room member
        const existingMembership = await RoomMembership.findOne({
          userId,
          roomId
        });
        if (existingMembership) 
        {
          return res.status(400).json({ error: "User is already a room member" });
        }
    
        //create membership nya room ke user
        const membership = new RoomMembership({
          userId,
          roomId,
          role: 'member'
        });
    
        await membership.save();
    
        //add user ke room memebers
        room.members.push(userId);
        room.memberCount = room.members.length;
        await room.save();
    
        //add ke joinedRooms user
        await User.findByIdAndUpdate(userId, 
        {
          $push: { joinedRooms: roomId }
        });
    
        const populatedMembership = await membership.populate('userId', 'username avatar');
    
        res.status(201).json({
          message: "Member successfully added to room",
          data: populatedMembership
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};

//UPDATE member role room member
exports.updateMemberRole = async (req, res) =>
{
    try 
    {
        const { rid, uid } = req.params;
        const { role } = req.body;
        const requesterId = req.userId;
    
        if (!role || !['member', 'moderator', 'admin'].includes(role)) 
        {
          return res.status(400).json({ 
            error: "Role must be either: member, moderator, admin" 
          });
        }
    
        //check if room existing
        const room = await Room.findById(rid);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //authorization check (admin only yang update role)
        const requesterMembership = await RoomMembership.findOne({
          roomId: rid,
          userId: requesterId
        });
    
        if (room.creator.toString() !== requesterId && requesterMembership?.role !== 'admin') 
        {
          return res.status(403).json({ 
            error: "Only admin can update member role"
          });
        }
    
        //role update
        const updatedMembership = await RoomMembership.findOneAndUpdate(
          { roomId: rid, userId: uid },
          { role },
          { new: true }
        ).populate('userId', 'username avatar');
    
        if (!updatedMembership) {
          return res.status(404).json({ 
            error: "Member not found in this room" 
          });
        }
    
        res.status(200).json({
          message: "Member role successfully updated",
          data: updatedMembership
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
}
  
//DELETE status membership user / kick user dari room
exports.kickMemberById = async (req, res) => 
{
    try 
    {
        const { rid, uid } = req.params;
        const requesterId = req.userId;
    
        //roomcheck ada apa ga
        const room = await Room.findById(rid);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //authorization, author only yng kick
        if (room.creator.toString() !== requesterId) 
        {
          return res.status(403).json({ 
            error: "Only room creator can kick members"
          });
        }
    
        //biar creator ga kick diri sendiri
        if (uid === room.creator.toString()) 
        {
          return res.status(400).json({ 
            error: "Creator can't be kicked from their own room" 
          });
        }
    
        //room membership deletion
        await RoomMembership.deleteOne({ roomId: rid, userId: uid });
    
        //remove from room members
        room.members = room.members.filter(memberId => memberId.toString() !== uid);
        room.memberCount = room.members.length;
        await room.save();
    
        //remove dari joinedRooms user
        await User.findByIdAndUpdate(uid, 
        {
          $pull: { joinedRooms: rid }
        });
    
        res.status(200).json({
          message: "Member successfully kicked from room"
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
};