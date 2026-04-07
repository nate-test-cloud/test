import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 5000;
const SECRET = "supersecretkey";

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

//Dummy user (password = 123456)
const user = {
  id: 1,
  email: "test@gmail.com",
  password: "$2b$10$AW3hAehK5DJ1hVqq87PpV.E3GREBZ/Kt./51fjehKvv0pIsH6sGoi" // hash of 123456
};

//LOGIN
app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id }, SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.json({ message: "Login successful" });
});

//VERIFY (protect routes)
app.get("/api/v1/verify", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
});

//LOGOUT
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});