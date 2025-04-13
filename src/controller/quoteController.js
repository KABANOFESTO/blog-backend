import User from "../Database/models/user.js";
import Quote from "../Database/models/quote.js";

// Add a new quote
export const addQuote = async (req, res) => {
  try {
    const { quoteText, author, category } = req.body;
    const userId = req.loggedInUser.id;

    // Validate input
    if (!quoteText?.trim() || !author?.trim() || !category?.trim()) {
      return res.status(400).json({
        status: "400",
        message: "Quote text, author, and category are required"
      });
    }

    // Create quote
    const quote = await Quote.create({
      quoteText,
      author,
      category,
      userId
    });

    return res.status(201).json({
      status: "201",
      message: "Quote added successfully",
      data: quote
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to add quote",
      error: error.message
    });
  }
};

// Get all quotes
export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: "200",
      message: "Quotes retrieved successfully",
      data: quotes
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve quotes",
      error: error.message
    });
  }
};

// Get a single quote
export const getSingleQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    if (!quote) {
      return res.status(404).json({
        status: "404",
        message: "Quote not found"
      });
    }

    return res.status(200).json({
      status: "200",
      message: "Quote retrieved successfully",
      data: quote
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to retrieve quote",
      error: error.message
    });
  }
};

// Update a quote
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { quoteText, author, category } = req.body;
    const userId = req.loggedInUser.id;

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return res.status(404).json({
        status: "404",
        message: "Quote not found"
      });
    }

    // Check if user is authorized to update
    if (quote.userId !== userId) {
      return res.status(403).json({
        status: "403",
        message: "Not authorized to update this quote"
      });
    }

    // Update quote
    await quote.update({
      quoteText: quoteText || quote.quoteText,
      author: author || quote.author,
      category: category || quote.category
    });

    return res.status(200).json({
      status: "200",
      message: "Quote updated successfully",
      data: quote
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to update quote",
      error: error.message
    });
  }
};

// Delete a quote
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.loggedInUser.id;

    const quote = await Quote.findByPk(id);

    if (!quote) {
      return res.status(404).json({
        status: "404",
        message: "Quote not found"
      });
    }

    // Check if user is authorized to delete
    if (quote.userId !== userId) {
      return res.status(403).json({
        status: "403",
        message: "Not authorized to delete this quote"
      });
    }

    await quote.destroy();

    return res.status(200).json({
      status: "200",
      message: "Quote deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "Failed to delete quote",
      error: error.message
    });
  }
};