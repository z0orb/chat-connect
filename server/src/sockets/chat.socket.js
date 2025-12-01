const { Server } = require('socket.io');

module.exports = (server) => 
{
  const io = new Server(server, 
  {
    cors: { origin: '*' }
  });

  //store user di room
  const usersInRoom = {};

  io.on('connection', (socket) => 
    {
    console.log('User connected:', socket.id);

    //join room
    socket.on('join_room', (data) => 
    {
      const { roomId, userId, username } = data;

      socket.join(roomId);

      if (!usersInRoom[roomId]) 
      {
        usersInRoom[roomId] = [];
      }

      usersInRoom[roomId].push({ userId, username, socketId: socket.id });

      //broadcast join user
      io.to(roomId).emit('user_joined', 
      {
        message: `${username} joined the room`,
        users: usersInRoom[roomId],
        count: usersInRoom[roomId].length
      });

      console.log(`User ${username} joined room ${roomId}`);
    });

    //send message
    socket.on('send_message', (data) => 
    {
      const { roomId, userId, username, message, timestamp } = data;

      io.to(roomId).emit('receive_message', 
      {
        userId,
        username,
        message,
        timestamp: timestamp || new Date()
      });

      console.log(`Message from ${username} in ${roomId}: ${message}`);
    });

    //message edit
    socket.on('edit_message', (data) => 
    {
      const { roomId, messageId, newContent } = data;

      io.to(roomId).emit('message_edited', 
      {
        messageId,
        newContent,
        editedAt: new Date()
      });
    });

    //ngedelete message
    socket.on('delete_message', (data) => {
      const { roomId, messageId } = data;

      io.to(roomId).emit('message_deleted', {
        messageId
      });
    });

    //indicator typing
    socket.on('user_typing', (data) => {
      const { roomId, username } = data;

      socket.to(roomId).emit('user_typing', { username });
    });

    socket.on('user_stop_typing', (data) => {
      const { roomId, username } = data;

      socket.to(roomId).emit('user_stop_typing', { username });
    });

    //disconnect
    socket.on('disconnect', () => {
      //remove user dari semua room kalo disconnect
      for (let roomId in usersInRoom) {
        const userIndex = usersInRoom[roomId].findIndex(
          u => u.socketId === socket.id
        );

        if (userIndex !== -1) {
          const user = usersInRoom[roomId][userIndex];
          usersInRoom[roomId].splice(userIndex, 1);

          io.to(roomId).emit('user_left', {
            message: `${user.username} left the room`,
            users: usersInRoom[roomId],
            count: usersInRoom[roomId].length
          });
        }
      }

      console.log('User disconnected:', socket.id);
    });
  });
};
