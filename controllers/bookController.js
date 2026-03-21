const { validationResult } = require('express-validator');
const Book = require('../models/Book');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

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

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
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
};
