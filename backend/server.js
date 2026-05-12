import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
  getBooks,
  getBookById,
  updateBook,
  searchBooks,
  getIssuedBooks,
  addIssuedBook,
  updateIssuedBook,
  getPurchases,
  addPurchase,
  getNotifications,
  updateNotification,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartItem,
  updateCartItem
} from "./db.js";

const app = express();
const PORT = 5000;
const SECRET = "supersecretkey";

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// SIGNUP
app.post("/api/v1/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = addUser({
      name,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    });

    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;

  const user = getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.json({ message: "Login successful" });
});

// VERIFY
app.get("/api/v1/verify", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// GET BOOKS
app.get("/api/v1/books", verifyToken, (req, res) => {
  const books = getBooks();
  res.json(books);
});

// GET BOOK BY ID
app.get("/api/v1/books/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const book = getBookById(parseInt(id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

// ISSUE BOOK
app.post("/api/v1/books/:id/issue", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const book = getBookById(parseInt(id));
  if (!book || book.available_copies <= 0) {
    return res.status(400).json({ message: "Book not available" });
  }

  // Check if user already has this book issued
  const issuedBooks = getIssuedBooks(userId);
  const existing = issuedBooks.find(ib => ib.book_id === parseInt(id) && ib.status === 'issued');
  if (existing) {
    return res.status(400).json({ message: "Book already issued to you" });
  }

  // Issue the book
  const issueDate = new Date().toISOString().split('T')[0];
  const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  addIssuedBook({
    user_id: userId,
    book_id: parseInt(id),
    issue_date: issueDate,
    return_date: returnDate,
    status: 'issued'
  });

  // Update available copies
  updateBook(parseInt(id), { available_copies: book.available_copies - 1 });

  res.json({ message: "Book issued successfully" });
});

// RETURN BOOK
app.post("/api/v1/books/:id/return", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const issuedBooks = getIssuedBooks(userId);
  const issuedBook = issuedBooks.find(ib => ib.book_id === parseInt(id) && ib.status === 'issued');

  if (!issuedBook) {
    return res.status(400).json({ message: "Book not found in your issued books" });
  }

  updateIssuedBook(issuedBook.id, { status: 'returned' });

  // Update available copies
  const book = getBookById(parseInt(id));
  updateBook(parseInt(id), { available_copies: book.available_copies + 1 });

  res.json({ message: "Book returned successfully" });
});

// GET ISSUED BOOKS
app.get("/api/v1/issued", verifyToken, (req, res) => {
  const userId = req.user.id;
  const issuedBooks = getIssuedBooks(userId);
  const books = getBooks();

  const result = issuedBooks
    .filter(ib => ib.status === 'issued')
    .map(ib => {
      const book = books.find(b => b.id === ib.book_id);
      const returnDateObj = new Date(ib.return_date);
      const today = new Date();
      const diffTime = returnDateObj - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...ib,
        title: book?.title,
        author: book?.author,
        cover: book?.cover,
        content: book?.content,
        days_remaining: diffDays,
        online_price: book?.online_price,
        offline_price: book?.offline_price
      };
    });

  res.json(result);
});

// PURCHASE BOOK
app.post("/api/v1/books/:id/purchase", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const book = getBookById(parseInt(id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  addPurchase({
    user_id: userId,
    book_id: parseInt(id),
    purchase_date: new Date().toISOString(),
    price: book.price
  });

  res.json({ message: "Book purchased successfully" });
});

// GET PURCHASES
app.get("/api/v1/purchases", verifyToken, (req, res) => {
  const userId = req.user.id;
  const purchases = getPurchases(userId);
  const books = getBooks();

  const result = purchases.map(p => {
    const book = books.find(b => b.id === p.book_id);
    return {
      ...p,
      title: book?.title,
      author: book?.author,
      cover: book?.cover
    };
  });

  res.json(result);
});

// GET NOTIFICATIONS
app.get("/api/v1/notifications", verifyToken, (req, res) => {
  const userId = req.user.id;
  const notifications = getNotifications(userId);
  res.json(notifications);
});

// MARK NOTIFICATION AS READ
app.put("/api/v1/notifications/:id/read", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = updateNotification(parseInt(id), { read: true });

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json({ message: "Notification marked as read" });
});

// GET USER PROFILE
app.get("/api/v1/profile", verifyToken, (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userProfile } = user;
  res.json(userProfile);
});

// UPDATE USER PROFILE
app.put("/api/v1/profile", verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email;
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateUser(userId, updates);

  res.json({ message: "Profile updated successfully" });
});

// SEARCH BOOKS
app.get("/api/v1/books/search/:query", verifyToken, (req, res) => {
  const { query } = req.params;
  const books = searchBooks(query);
  res.json(books);
});

// GET CART
app.get("/api/v1/cart", verifyToken, (req, res) => {
  const userId = req.user.id;
  const cartItems = getCart(userId);
  const books = getBooks();

  const result = cartItems.map(item => {
    const book = books.find(b => b.id === item.book_id);
    return {
      ...item,
      title: book?.title,
      author: book?.author,
      cover: book?.cover,
      price: item.price ?? book?.price,
      available_copies: book?.available_copies,
      mode: item.mode || "offline"
    };
  });

  res.json(result);
});

// ADD TO CART
app.post("/api/v1/cart", verifyToken, (req, res) => {
  const bookId = parseInt(req.body.book_id, 10);
  const quantity = parseInt(req.body.quantity, 10) || 1;
  const mode = req.body.mode === "online" ? "online" : "offline";
  const userId = req.user.id;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  const book = getBookById(bookId);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const selectedPrice = mode === "online"
    ? book.online_price ?? book.price
    : book.offline_price ?? book.price;

  // Check if book already in cart with same mode
  const existingItem = getCart(userId).find(c => c.book_id === bookId && c.mode === mode);
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > book.available_copies) {
      return res.status(400).json({ message: "Not enough copies available" });
    }
    const updated = updateCartItem(existingItem.id, { quantity: newQuantity, price: selectedPrice });
    return res.json({ message: "Cart updated", item: updated });
  }

  if (quantity > book.available_copies) {
    return res.status(400).json({ message: "Not enough copies available" });
  }

  const cartItem = addToCart({
    user_id: userId,
    book_id: bookId,
    quantity: quantity || 1,
    mode,
    price: selectedPrice,
    added_at: new Date().toISOString()
  });

  res.json({ message: "Book added to cart", item: cartItem });
});

// REMOVE FROM CART
app.delete("/api/v1/cart/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const cartItem = getCart(userId).find(c => c.id === parseInt(id));
  if (!cartItem) {
    return res.status(400).json({ message: "Item not found in cart" });
  }

  removeFromCart(parseInt(id));
  res.json({ message: "Item removed from cart" });
});

// CHECKOUT (Purchase all items in cart)
app.post("/api/v1/cart/checkout", verifyToken, (req, res) => {
  const userId = req.user.id;
  const cartItems = getCart(userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  try {
    cartItems.forEach(item => {
      const book = getBookById(item.book_id);
      if (!book || item.quantity > book.available_copies) {
        return;
      }

      const mode = item.mode === "online" ? "online" : "offline";
      const price = item.price ?? (mode === "online" ? book.online_price ?? book.price : book.offline_price ?? book.price);

      if (mode === "offline") {
        addPurchase({
          user_id: userId,
          book_id: item.book_id,
          quantity: item.quantity,
          price: price * item.quantity,
          purchase_date: new Date().toISOString(),
          mode
        });
      } else {
        const issueDate = new Date();
        const returnDate = new Date(issueDate);
        returnDate.setDate(returnDate.getDate() + 14);

        addIssuedBook({
          user_id: userId,
          book_id: item.book_id,
          quantity: item.quantity,
          issue_date: issueDate.toISOString().split("T")[0],
          return_date: returnDate.toISOString().split("T")[0],
          status: "issued",
          mode,
          price: price * item.quantity
        });
      }

      updateBook(item.book_id, { available_copies: book.available_copies - item.quantity });
    });

    clearCart(userId);

    res.json({ message: "Purchase successful" });
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});