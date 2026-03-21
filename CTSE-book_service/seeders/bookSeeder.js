require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');
const { defaultBooks } = require('./bootstrapBooks');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

const importData = async () => {
  try {
    await connectDB();
    await Book.deleteMany({});
    await Book.insertMany(defaultBooks);
    console.log(`Seeded ${defaultBooks.length} books.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    const result = await Book.deleteMany({});
    console.log(`Deleted ${result.deletedCount} books.`);
    process.exit(0);
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
