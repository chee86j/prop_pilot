import { Router } from "express";
import { User } from "../models/index.js";
import {
  validateEmail,
  validatePassword,
  createAuthResponse,
} from "../middleware/auth.js";
import logger from "../utils/logger.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate email and password
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000 // 1 hour
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
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
  res.clearCookie('jwt');
  res.json({ message: "Logged out successfully" });
});

router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'firstName', 'lastName']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export default router;
