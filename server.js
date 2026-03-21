require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { seedDefaultBooks } = require('./seeders/bootstrapBooks');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'book-service', timestamp: new Date().toISOString() });
});

app.use('/books', bookRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.ENABLE_BOOTSTRAP_BOOKS === 'true') {
      await seedDefaultBooks();
    }

    app.listen(PORT, () => {
      console.log(`Book service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start book service: ${error.message}`);
    process.exit(1);
  }
};

startServer();
