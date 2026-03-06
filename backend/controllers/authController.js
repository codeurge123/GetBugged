import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

// SIGNUP
async function signup(req, res) {
  console.log("Signup request received");
  console.log("Body:", req.body);

  const { email, password, name } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    console.log("Checking existing user");

    let existing = await User.findOne({ email });

    if (existing) {
      console.log("User already exists");
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.log("Hashing password");
    const hash = await bcrypt.hash(password, 10);

    console.log("Creating user");
    const user = await User.create({
      email,
      password: hash,
      name
    });

    console.log("User created:", user._id);

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken: token
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: 'Signup failed',
      error: err.message
    });
  }
}


// LOGIN
async function login(req, res) {
  console.log("Login request received");
  console.log("Body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    console.log("Finding user");

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      console.log("User not found or password missing");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Comparing password");

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Password mismatch");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("Generating token");

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken: token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: 'Login failed',
      error: err.message
    });
  }
}


// GOOGLE CALLBACK
function googleCallback(req, res) {
  try {
    console.log("Google callback triggered");

    const token = generateToken(req.user);

    const frontend = process.env.CLIENT_URL || 'http://localhost:3000';

    const query = new URLSearchParams({
      accessToken: token,
      email: req.user.email,
      name: req.user.name
    }).toString();

    res.redirect(`${frontend}/auth/callback?${query}`);

  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ message: "Google auth failed" });
  }
}


// LOGOUT
function logout(req, res) {
  try {
    console.log("Logout request");

    req.logout?.();

    res.json({ message: 'Logged out' });

  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
}


// UPDATE NAME
async function updateName(req, res) {

  console.log("Update name request");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Valid name required' });
  }

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name.trim();

    await user.save();

    res.json({
      message: 'Name updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("Update name error:", err);

    res.status(500).json({
      message: 'Update name failed',
      error: err.message
    });
  }
}

export { signup, login, googleCallback, logout, updateName };