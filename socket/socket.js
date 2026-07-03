const { Server } = require("socket.io");
const Message = require("../model/messagemodel");
const Conversation = require("../model/conversationmodel");

let io;

const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://p3c87dgd-5173.inc1.devtunnels.ms",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // user login
    // socket.on("join", (userId) => {
    //   onlineUsers.set(userId, socket.id);

    //   console.log("Online Users");
    //   console.log(onlineUsers);
    // });
    socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);

        io.emit("onlineUsers", [...onlineUsers.keys()]);

        console.log("Online Users:", [...onlineUsers.keys()]);
    });

    socket.on("sendMessage", async (data) => {
  try {
    const { sender, receiver, text } = data;

    // Conversation find
    let conversation = await Conversation.findOne({
      members: {
        $all: [sender, receiver],
      },
    });

    // Create if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        members: [sender, receiver],
      });
    }

    // Save message
    const message = await Message.create({
      conversationId: conversation._id,
      sender,
      receiver,
      text,
    });

    // Receiver online?
    const receiverSocket = onlineUsers.get(receiver);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", message);
    }

    // Sender ko bhi return
    socket.emit("messageSaved", message);
  } catch (err) {
    console.log(err);
  }
});

    // socket.on("disconnect", () => {
    //   for (const [userId, socketId] of onlineUsers.entries()) {
    //     if (socketId === socket.id) {
    //       onlineUsers.delete(userId);
    //       break;
    //     }
    //   }

    //   console.log("Disconnected:", socket.id);
    // });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }

        io.emit("onlineUsers", [...onlineUsers.keys()]);

        console.log("Disconnected:", socket.id);
    });
  });
};

const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};

const getIO = () => io;

module.exports = {
  initSocket,
  getReceiverSocketId,
  getIO,
};