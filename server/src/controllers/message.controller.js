const Message = require('../models/Message');
const Room = require('../models/Room');

//GET semua message
exports.getAll = async (req, res) =>
{
    try 
    {
        const { roomId } = req.query;
    
        let query = {};
        if (roomId) 
        {
          query.room = roomId;
        }
    
        const messages = await Message.find(query)
          .populate('sender', 'username avatar')
          .populate('room', 'roomName')
          .sort({ createdAt: -1 })
          .limit(100);
    
        res.status(200).json({
          message: "Successfully fetched all messages",
          count: messages.length,
          data: messages.reverse() //oldest ke newest
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
}

//CREATE new message
exports.sendMessage = async (req, res) =>
{
    try 
    {
        const { roomId, content } = req.body;
        const senderId = req.userId;
    
        if (!roomId || !content || content.trim() === '') 
        {
          return res.status(400).json({ 
            error: "Room ID and content must be filled"
          });
        }
    
        //check if room nya existing
        const room = await Room.findById(roomId);
        if (!room) 
        {
          return res.status(404).json({ error: "Room not found" });
        }
    
        //check if usernya adalah member room
        if (!room.members.includes(senderId)) 
        {
          return res.status(403).json({ 
            error: "You're not a member of this room" 
          });
        }
    
        //create message nya
        const newMessage = new Message({
          content,
          sender: senderId,
          room: roomId
        });
    
        await newMessage.save();
    
        const populatedMessage = await newMessage
          .populate('sender', 'username avatar')
          .populate('room', 'roomName');
    
        res.status(201).json({
          message: "Message successfully sent",
          data: populatedMessage
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
}

//DELETE message from chat by message id
exports.deleteMessage = async (req, res) =>
{
    try 
    {
        const { msgid } = req.params;
        const userId = req.userId;
    
        const message = await Message.findById(msgid);
        if (!message) 
        {
          return res.status(404).json({ error: "Message not found" });
        }
    
        //authorization check, yg bisa delete author sama sender
        const room = await Room.findById(message.room);
        if (message.sender.toString() !== userId && room.creator.toString() !== userId) 
        {
          return res.status(403).json({ 
            error: "Only sender or room author can delete" 
          });
        }
    
        await Message.findByIdAndDelete(msgid);
    
        res.status(200).json({
          message: "Message successfully deleted"
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
}

//UPDATE message (editing message by message id)
exports.editMessage = async (req, res) =>
{
    try 
    {
        const { msgid } = req.params;
        const { content } = req.body;
        const userId = req.userId;
    
        if (!content || content.trim() === '') 
        {
          return res.status(400).json({ error: "Content must be filled" });
        }
    
        //check msg nya exist gk
        const message = await Message.findById(msgid);
        if (!message) 
        {
          return res.status(404).json({ error: "Message not found" });
        }
    
        //authorization check biar gak diedit random
        if (message.sender.toString() !== userId) 
        {
          return res.status(403).json({ 
            error: "Only the message's sender can edit"
          });
        }
    
        //update msg nya
        const updatedMessage = await Message.findByIdAndUpdate(
          msgid,
          {
            content,
            isEdited: true,
            editedAt: new Date()
          },
          { new: true }
        ).populate('sender', 'username avatar')
         .populate('room', 'roomName');
    
        res.status(200).json({
          message: "Message successfully updated",
          data: updatedMessage
        });
      } 
      
      catch (err) 
      {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
      }
}