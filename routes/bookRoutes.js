const express = require('express');
const { body } = require('express-validator');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

const createBookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number or zero'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or greater'),
  body('image').trim().notEmpty().withMessage('Image URL is required').isURL().withMessage('Image must be a valid URL'),
];

const updateBookValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number or zero'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be 0 or greater'),
  body('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty').isURL().withMessage('Image must be a valid URL'),
];

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', protect, adminOnly, createBookValidation, createBook);
router.put('/:id', protect, adminOnly, updateBookValidation, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
