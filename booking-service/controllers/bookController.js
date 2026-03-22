const { validationResult } = require('express-validator');
const axios = require('axios');
const Book = require('../models/Book');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5003';

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};//gdhfj

const getBooks = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      titleAsc: { title: 1 },
      titleDesc: { title: -1 },
    };

    const books = await Book.find(query).sort(sortMap[sort] || { createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw createHttpError(404, 'Book not found');
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw createHttpError(404, 'Book not found');
    }

    const allowedFields = ['title', 'author', 'price', 'category', 'description', 'stock', 'image'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    }

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw createHttpError(404, 'Book not found');
    }

    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/book/${req.params.id}/exists`, {
        headers: {
          Authorization: req.headers.authorization,
        },
      });

      if (response.data?.exists) {
        throw createHttpError(409, 'Book cannot be deleted because it is used in an order');
      }
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }

      throw createHttpError(503, 'Unable to verify order references before deleting book');
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Decrement stock for a book
const decrementStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      throw createHttpError(400, 'Quantity must be at least 1');
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw createHttpError(404, 'Book not found');
    }
    if (book.stock < quantity) {
      throw createHttpError(400, 'Not enough stock available');
    }
    book.stock -= quantity;
    await book.save();
    res.status(200).json({ success: true, message: 'Stock decremented', stock: book.stock });
  } catch (error) {
    next(error);
  }
};

// Restore stock for a book
const restoreStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      throw createHttpError(400, 'Quantity must be at least 1');
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw createHttpError(404, 'Book not found');
    }
    book.stock += quantity;
    await book.save();
    res.status(200).json({ success: true, message: 'Stock restored', stock: book.stock });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  decrementStock,
  restoreStock,
};
