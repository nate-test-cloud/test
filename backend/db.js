import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
let db = {
  users: [],
  books: [],
  issued_books: [],
  purchases: [],
  notifications: [],
  carts: []
};

if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Normalize missing collections
const normalizeDB = () => {
  db.users = Array.isArray(db.users) ? db.users : [];
  db.books = Array.isArray(db.books) ? db.books : [];
  db.issued_books = Array.isArray(db.issued_books) ? db.issued_books : [];
  db.purchases = Array.isArray(db.purchases) ? db.purchases : [];
  db.notifications = Array.isArray(db.notifications) ? db.notifications : [];
  db.carts = Array.isArray(db.carts) ? db.carts : [];
};

normalizeDB();

// Save database
const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// Initialize with dummy data
const initializeData = async () => {
  if (db.users.length === 0) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    db.users.push({
      id: 1,
      name: 'Test User',
      email: 'test@gmail.com',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
  }

  if (db.books.length === 0) {
    db.books = [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: 'https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=The+Great+Gatsby',
        description: 'A classic American novel set in the Jazz Age.',
        price: 299,
        available_copies: 5,
        total_copies: 5,
        rating: 4,
        genre: 'Fiction',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: '1984',
        author: 'George Orwell',
        cover: 'https://via.placeholder.com/300x400/10B981/FFFFFF?text=1984',
        description: 'A dystopian social science fiction novel.',
        price: 349,
        available_copies: 3,
        total_copies: 5,
        rating: 5,
        genre: 'Dystopian',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover: 'https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=To+Kill+a+Mockingbird',
        description: 'A novel about racial injustice and childhood.',
        price: 399,
        available_copies: 4,
        total_copies: 4,
        rating: 5,
        genre: 'Fiction',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: 'https://via.placeholder.com/300x400/EC4899/FFFFFF?text=Pride+and+Prejudice',
        description: 'A romantic novel of manners.',
        price: 249,
        available_copies: 6,
        total_copies: 6,
        rating: 4,
        genre: 'Romance',
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        cover: 'https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=The+Hobbit',
        description: 'A fantasy adventure novel.',
        price: 449,
        available_copies: 2,
        total_copies: 5,
        rating: 5,
        genre: 'Fantasy',
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://via.placeholder.com/300x400/6B7280/FFFFFF?text=Dune',
        description: 'A science fiction epic.',
        price: 499,
        available_copies: 1,
        total_copies: 3,
        rating: 4,
        genre: 'Science Fiction',
        created_at: new Date().toISOString()
      },
      {
        id: 7,
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        cover: 'https://via.placeholder.com/300x400/14B8A6/FFFFFF?text=The+Alchemist',
        description: 'A philosophical novel about following dreams.',
        price: 299,
        available_copies: 4,
        total_copies: 4,
        rating: 4,
        genre: 'Philosophy',
        created_at: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Brave New World',
        author: 'Aldous Huxley',
        cover: 'https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Brave+New+World',
        description: 'A dystopian novel about a future society.',
        price: 349,
        available_copies: 3,
        total_copies: 3,
        rating: 3,
        genre: 'Dystopian',
        created_at: new Date().toISOString()
      }
    ];
  }

  if (db.issued_books.length === 0) {
    db.issued_books = [
      {
        id: 1,
        user_id: 1,
        book_id: 5,
        issue_date: '2026-04-01',
        return_date: '2026-04-10',
        status: 'issued'
      },
      {
        id: 2,
        user_id: 1,
        book_id: 4,
        issue_date: '2026-04-05',
        return_date: '2026-04-15',
        status: 'issued'
      }
    ];
  }

  if (db.purchases.length === 0) {
    db.purchases = [
      {
        id: 1,
        user_id: 1,
        book_id: 2,
        purchase_date: new Date().toISOString(),
        price: 349
      },
      {
        id: 2,
        user_id: 1,
        book_id: 6,
        purchase_date: new Date().toISOString(),
        price: 499
      }
    ];
  }

  if (db.notifications.length === 0) {
    db.notifications = [
      {
        id: 1,
        user_id: 1,
        message: "Your book '1984' is due tomorrow.",
        type: 'warning',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_id: 1,
        message: "New book 'Dune' is now available.",
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        user_id: 1,
        message: "Payment successful for 'The Hobbit'.",
        type: 'success',
        read: false,
        created_at: new Date().toISOString()
      }
    ];
  }

  saveDB();
  console.log('Database initialized with dummy data');
};

initializeData();

// Database operations
export const getUsers = () => db.users;
export const getUserByEmail = (email) => db.users.find(u => u.email === email);
export const getUserById = (id) => db.users.find(u => u.id === id);
export const addUser = (user) => {
  user.id = db.users.length + 1;
  db.users.push(user);
  saveDB();
  return user;
};
export const updateUser = (id, updates) => {
  const user = db.users.find(u => u.id === id);
  if (user) {
    Object.assign(user, updates);
    saveDB();
  }
  return user;
};

export const getBooks = () => db.books;
export const getBookById = (id) => db.books.find(b => b.id === id);
export const updateBook = (id, updates) => {
  const book = db.books.find(b => b.id === id);
  if (book) {
    Object.assign(book, updates);
    saveDB();
  }
  return book;
};
export const searchBooks = (query) => {
  const lowerQuery = query.toLowerCase();
  return db.books.filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    book.genre.toLowerCase().includes(lowerQuery)
  );
};

export const getIssuedBooks = (userId) => db.issued_books.filter(ib => ib.user_id === userId);
export const addIssuedBook = (issuedBook) => {
  issuedBook.id = db.issued_books.length + 1;
  db.issued_books.push(issuedBook);
  saveDB();
  return issuedBook;
};
export const updateIssuedBook = (id, updates) => {
  const issuedBook = db.issued_books.find(ib => ib.id === id);
  if (issuedBook) {
    Object.assign(issuedBook, updates);
    saveDB();
  }
  return issuedBook;
};

export const getPurchases = (userId) => db.purchases.filter(p => p.user_id === userId);
export const addPurchase = (purchase) => {
  purchase.id = db.purchases.length + 1;
  db.purchases.push(purchase);
  saveDB();
  return purchase;
};

export const getNotifications = (userId) => db.notifications.filter(n => n.user_id === userId);
export const updateNotification = (id, updates) => {
  const notification = db.notifications.find(n => n.id === id);
  if (notification) {
    Object.assign(notification, updates);
    saveDB();
  }
  return notification;
};

// Cart operations
const getCartArray = () => {
  if (!Array.isArray(db.carts)) {
    db.carts = [];
  }
  return db.carts;
};

export const getCart = (userId) => getCartArray().filter(c => c.user_id === userId);
export const addToCart = (cartItem) => {
  const carts = getCartArray();
  cartItem.id = carts.length + 1;
  carts.push(cartItem);
  saveDB();
  return cartItem;
};
export const removeFromCart = (cartId) => {
  const index = db.carts.findIndex(c => c.id === cartId);
  if (index > -1) {
    db.carts.splice(index, 1);
    saveDB();
    return true;
  }
  return false;
};
export const clearCart = (userId) => {
  db.carts = getCartArray().filter(c => c.user_id !== userId);
  saveDB();
};
export const getCartItem = (userId, bookId) => {
  return getCartArray().find(c => c.user_id === userId && c.book_id === bookId);
};
export const updateCartItem = (cartId, updates) => {
  const cartItem = db.carts.find(c => c.id === cartId);
  if (cartItem) {
    Object.assign(cartItem, updates);
    saveDB();
  }
  return cartItem;
};

export default db;