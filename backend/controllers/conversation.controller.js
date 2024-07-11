const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model.js");
const { getRecieverId } = require("../socket/socket.js");

const io = require("../socket/socket").io;
class ConversationController {
  async sendMessage(req, res, next) {
    const { message, senderId } = req.body;
    const receiverId = req.params.id;
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
      // this will run in parallel
      await Promise.all([conversation.save(), newMessage.save()]);

      const recieverId = getRecieverId(receiverId);

      if (recieverId) {
        io.to(recieverId).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
  async getMessages(req, res) {
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user._id;
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
      if (!conversation) return res.status(200).json([]);
      const messages = conversation.messages;
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages Controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new ConversationController();
