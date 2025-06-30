import { Router } from "express";
import { User } from "../models/index.js";
import {
  validateEmail,
  validatePassword,
  createAuthResponse,
} from "../middleware/auth.js";
import logger from "../utils/logger.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate required fields
    const requiredFields = {
      first_name: "First name is required",
      last_name: "Last name is required",
      email: "Valid email is required",
      password: "Password is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message: message });
      }
    }

    // Validate email and password
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 12 characters long and contain uppercase, lowercase, number, and special character",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user
    const user = await User.create({
      first_name,
      last_name,
      email,
    });

    await user.setPassword(password);
    await user.save();

    const authResponse = await createAuthResponse(user);
    res.status(201).json({
      ...authResponse,
      message: "User created successfully",
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authResponse = await createAuthResponse(user);
    res.json(authResponse);
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { token_info, userInfo } = req.body;

    if (!token_info || !userInfo) {
      logger.error("Missing required data in request");
      return res.status(400).json({ message: "Missing required data" });
    }

    // Verify token hasn't expired
    if (token_info.exp * 1000 < Date.now()) {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Verify audience matches our client ID
    if (token_info.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Invalid client ID" });
    }

    // Verify email is verified
    if (!userInfo.email_verified) {
      return res.status(401).json({ message: "Email not verified by Google" });
    }

    const { email, given_name, family_name, picture } = userInfo;

    // Find or create user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        first_name: given_name || "",
        last_name: family_name || "",
        avatar: picture || null,
      });
    }

    const authResponse = await createAuthResponse(user);
    res.json(authResponse);
  } catch (error) {
    logger.error("Google authentication error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during Google authentication" });
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
