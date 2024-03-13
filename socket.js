const io = require('socket.io')(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`+onlineUsers.size);
      io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));

   
    

      // socket.on('disconnect', () => {
      //   onlineUsers.delete(userId);
      //   console.log(`User ${userId} disconnected`+onlineUsers.size);
      //   io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
      // });
    } else {
      console.error('Missing user ID on socket connection');
    }
  });

  socket.on('message', (messageData) => {
    console.log(messageData);
    const recipientId = messageData.recipientId;
    const recipientSocketId = onlineUsers.get(recipientId);
    console.log(recipientSocketId, onlineUsers);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('forwardmessage', messageData);
    }
  });


});

module.exports = io;
