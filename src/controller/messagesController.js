import { Messages } from "../Database/models";

export const getAllMessages = async (req, res) => {
  try {
    // Fetch all messages from the database
    const allMessages = await Messages.findAll();

    // Respond with the retrieved messages
    res.status(200).json({
      success: true,
      messages: allMessages
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


export const addMessage = async (req, res) => {
  try {

    const { names, email, subject, message } = req.body;
    if (!names || !email || !subject || !message) {
      return res.status(400).json({
        status: "400",
        message: "All Fields Are Required",
      });
    }

    const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!verifyEmail.test(email)) {
      return res.status(400).json({
        status: "400",
        message: "Invalid Email",
      });
    }

    // Create a new message record in the database
    const newMessage = await Messages.create({
      names,
      email,
      subject,
      message,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Respond with the newly created message
    res.status(201).json({
      success: true,
      message: "Message added successfully",
      data: newMessage
    });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error adding message:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const Id = req.params.id;

    // Check if the message exists
    const message = await Messages.findByPk(Id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    // Delete the message
    await message.destroy();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
