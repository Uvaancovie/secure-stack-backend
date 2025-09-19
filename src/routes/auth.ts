import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators/auth";

const router = Router();

// Register endpoint
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { username, fullName, idNumber, accountNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { idNumber }, { accountNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: { code: "USER_EXISTS", message: "User already exists" }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      username,
      fullName,
      idNumber,
      accountNumber,
      passwordHash,
      role: "customer"
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Registration failed" }
    });
  }
});

// Login endpoint
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" }
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "24h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.COOKIE_DOMAIN
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Login failed" }
    });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    domain: process.env.COOKIE_DOMAIN,
    path: "/"
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        error: { code: "NO_TOKEN", message: "No authentication token" }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        error: { code: "USER_NOT_FOUND", message: "User not found" }
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({
      error: { code: "INVALID_TOKEN", message: "Invalid token" }
    });
  }
});

export default router;
