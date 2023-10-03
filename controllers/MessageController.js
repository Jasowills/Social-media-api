import Message from '../schemas/Message.js';

class MessageController {
  // Send a message
  static async sendMessage(req, res) {
    try {
      const { senderId, receiverId, text } = req.body;

      // Create a new message
      const message = new Message({ senderId, receiverId, text });

      // Save the message to the database
      await message.save();

      res.status(201).json({ message: 'Message sent successfully.', message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get conversation between senderId and receiverId
  static async getConversation(req, res) {
    try {
      const { senderId, receiverId } = req.params;

      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 });

      res.status(200).json({ messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default MessageController;
