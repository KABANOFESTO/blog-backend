import  Messages  from "../Database/models/messages.js";

export const getAllMessages = async (req, res) => {
  try {
    const allMessages = await Messages.findAll({
      order: [['createdAt', 'DESC']] // Order by newest first
    });

    return res.status(200).json({
      status: "200",
      success: true,
      message: "Messages retrieved successfully",
      data: allMessages
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      status: "500",
      success: false,
      message: "Failed to retrieve messages",
      error: error.message
    });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { names, email, subject, message } = req.body;

    // Validate required fields
    if (!names?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        status: "400",
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        status: "400",
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Create new message
    const newMessage = await Messages.create({
      names: names.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    return res.status(201).json({
      status: "201",
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({
      status: "500",
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        status: "400",
        success: false,
        message: "Message ID is required"
      });
    }

    // Check if message exists
    const message = await Messages.findByPk(id);
    if (!message) {
      return res.status(404).json({
        status: "404",
        success: false,
        message: "Message not found"
      });
    }

    // Delete message
    await message.destroy();

    return res.status(200).json({
      status: "200",
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      status: "500",
      success: false,
      message: "Failed to delete message",
      error: error.message
    });
  }
};