import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

function generateToken(id: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign({ id, email }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as string) || "7d",
  } as jwt.SignOptions);
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (e: any) => e.message
      );
      res.status(400).json({ error: messages.join(", ") });
      return;
    }
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    // Explicitly select password since it has select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
