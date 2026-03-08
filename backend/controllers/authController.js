import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

// SIGNUP
export const signup = async (req, res) => {
  try {
    console.log("Signup request:", req.body);

    const { email, password, name } = req.body;

    // validation
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      accessToken: token
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Signup failed",
      error: error.message
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    console.log("Login request:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // generate token
    const token = generateToken(user._id);

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      accessToken: token
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};


// GOOGLE CALLBACK
export const googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user._id);

    const frontend = process.env.CLIENT_URL || "http://localhost:3000";

    const query = new URLSearchParams({
      accessToken: token,
      email: req.user.email,
      name: req.user.name
    }).toString();

    res.redirect(`${frontend}/auth/callback?${query}`);

  } catch (error) {
    console.error("Google callback error:", error);

    res.status(500).json({
      message: "Google auth failed"
    });
  }
};


// LOGOUT
export const logout = (req, res) => {
  try {
    req.logout?.();

    res.json({
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      message: "Logout failed"
    });
  }
};


// UPDATE NAME
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

    res.json({
      message: "Name updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Update name error:", error);

    res.status(500).json({
      message: "Update name failed",
      error: error.message
    });
  }
};