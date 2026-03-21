const Book = require('../models/Book');

const defaultBooks = [
  {
    title: 'Madol Doova',
    author: 'Martin Wickramasinghe',
    price: 1200,
    category: 'Sinhala Literature',
    description: 'A classic Sri Lankan adventure story following Upali and Jinna as they escape to the island of Madol Doova.',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'The Seven Moons of Maali Almeida',
    author: 'Shehan Karunatilaka',
    price: 3500,
    category: 'English Fiction',
    description: 'A darkly comic literary mystery set in Sri Lanka, blending political tension, memory, and the supernatural.',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Anil\'s Ghost',
    author: 'Michael Ondaatje',
    price: 2800,
    category: 'Literary Fiction',
    description: 'A forensic anthropologist returns to Sri Lanka and uncovers a dangerous truth during a violent civil conflict.',
    stock: 9,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    price: 3200,
    category: 'Science',
    description: 'An accessible and inspiring journey through the history of science, astronomy, and humanity\'s place in the universe.',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    price: 2900,
    category: 'Children',
    description: 'The first entry in the beloved fantasy series introducing Harry Potter, Hogwarts, and the wizarding world.',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop',
  },
];

const seedDefaultBooks = async () => {
  const bookCount = await Book.countDocuments();

  if (bookCount > 0) {
    return;
  }

  await Book.insertMany(defaultBooks);
  console.log('Bootstrapped default books for local development.');
};

module.exports = { seedDefaultBooks, defaultBooks };
