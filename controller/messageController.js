const Message = require("../model/messageModel");
const SignupModel = require("../model/signupmodel");
const {
  getReceiverSocketId,
  getIO,
} = require("../socket/socket");


// Send Message
const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.params.id;

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    await message.populate("sender", "name profielpicture");
    await message.populate("receiver", "name profielpicture");

    // realtime
    const receiverSocket = getReceiverSocketId(receiver);

    if (receiverSocket) {
      getIO().to(receiverSocket).emit("newMessage", message);
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Get Conversation

const getConversation = async (req, res) => {
  try {
    const me = req.user.id;

    const other = req.params.id;

    const messages = await Message.find({
      $or: [
        {
          sender: me,
          receiver: other,
        },
        {
          sender: other,
          receiver: me,
        },
      ],
    })
      .populate("sender", "name profielpicture")
      .populate("receiver", "name profielpicture")
      .sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Seen

// const seenMessages = async (req, res) => {
//   try {
//     const me = req.user.id;

//     const other = req.params.id;

//     await Message.updateMany(
//       {
//         sender: other,
//         receiver: me,
//         seen: false,
//       },
//       {
//         seen: true,
//       }
//     );

//     res.json({
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

const seenMessages = async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.params.id;

    await Message.updateMany(
      {
        sender: other,
        receiver: me,
        seen: false,
      },
      {
        seen: true,
      }
    );

    // Notify the sender that his messages have been seen
    const receiverSocket = getReceiverSocketId(other);

    if (receiverSocket) {
      getIO().to(receiverSocket).emit("messagesSeen", {
        by: me,
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const getConversations = async (req, res) => {
//   try {
//     const me = req.user.id;

//     const users = await SignupModel.find({
//       _id: { $ne: me },
//     }).select("name profielpicture");

//     const list = await Promise.all(
//       users.map(async (user) => {
//         const last = await Message.findOne({
//           $or: [
//             {
//               sender: me,
//               receiver: user._id,
//             },
//             {
//               sender: user._id,
//               receiver: me,
//             },
//           ],
//         }).sort({
//           createdAt: -1,
//         });

//         const unread = await Message.countDocuments({
//           sender: user._id,
//           receiver: me,
//           seen: false,
//         });

//         return {
//           _id: user._id,
//           name: user.name,
//           profielpicture: user.profielpicture,
//           lastMsg: last?.text || "",
//           lastTime: last?.createdAt || null,
//           unread,
//         };
//       })
//     );

//     res.json(list);
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//     });
//   }
// };

const getConversations = async (req, res) => {
  try {
    const me = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: me },
        { receiver: me },
      ],
    }).sort({ createdAt: -1 });

    const ids = [
      ...new Set(
        messages.map((m) =>
          m.sender.toString() === me
            ? m.receiver.toString()
            : m.sender.toString()
        )
      ),
    ];

    const users = await SignupModel.find({
      _id: { $in: ids },
    }).select("name profielpicture");

    const conversations = await Promise.all(
      users.map(async (user) => {
        const last = await Message.findOne({
          $or: [
            { sender: me, receiver: user._id },
            { sender: user._id, receiver: me },
          ],
        }).sort({ createdAt: -1 });

        const unread = await Message.countDocuments({
          sender: user._id,
          receiver: me,
          seen: false,
        });

        return {
          _id: user._id,
          name: user.name,
          profielpicture: user.profielpicture,
          lastMsg: last?.text || "",
          lastTime: last?.createdAt,
          unread,
        };
      })
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// const unreadCount = async (req, res) => {
//   try {
//     const me = req.user.id;

//     const count = await Message.countDocuments({
//       receiver: me,
//       seen: false,
//     });

//     getIO().to(getReceiverSocketId(me)).emit("refreshUnread");

//     res.json({
//       success: true,
//       count,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const unreadCount = async (req, res) => {
  try {
    console.log("Logged User:", req.user);

    const me = req.user.id;

    const count = await Message.countDocuments({
      receiver: me,
      seen: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  seenMessages,
  getConversations,
  unreadCount,
};