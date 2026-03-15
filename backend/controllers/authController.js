import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";


// ======================
// SIGNUP
// ======================
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken: token
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};



// ======================
// LOGIN
// ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken: token
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};



// ======================
// GOOGLE CALLBACK
// ======================
export const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: "Google authentication failed"
      });
    }

    const token = generateToken(req.user._id);

    const frontend = process.env.CLIENT_URL || "http://localhost:5173";

    const query = new URLSearchParams({
      accessToken: token,
      email: req.user.email,
      name: req.user.name
    }).toString();

    return res.redirect(`${frontend}/auth/callback?${query}`);

  } catch (error) {
    console.error("Google callback error:", error);

    return res.status(500).json({
      message: "Google auth failed"
    });
  }
};



// ======================
// LOGOUT
// ======================
export const logout = (req, res) => {
  try {

    if (req.logout) {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({
            message: "Logout failed"
          });
        }

        return res.json({
          success: true,
          message: "Logged out successfully"
        });
      });
    } else {
      return res.json({
        success: true,
        message: "Logged out"
      });
    }

  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Logout failed"
    });
  }
};



// ======================
// UPDATE NAME
// ======================
export const updateName = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        message: "Valid name required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.name = name.trim();
    await user.save();

    return res.json({
      success: true,
      message: "Name updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Update name error:", error);

    return res.status(500).json({
      message: "Update name failed"
    });
  }
};