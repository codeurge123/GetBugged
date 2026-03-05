import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

async function signup(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });
    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

function googleCallback(req, res) {
  // passport will set req.user
  const token = generateToken(req.user);
  // redirect back to frontend with token and basic user info as query params
  const frontend = process.env.CLIENT_URL || 'http://localhost:3000';
  const query = new URLSearchParams({
    accessToken: token,
    email: req.user.email,
    name: req.user.name,
  }).toString();
  res.redirect(`${frontend}/auth/callback?${query}`);
}

function logout(req, res) {
  req.logout?.();
  res.json({ message: 'Logged out' });
}

async function updateName(req, res) {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Valid name required' });
  }
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name.trim();
    await user.save();
    
    res.json({ 
      message: 'Name updated successfully',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export { signup, login, googleCallback, logout, updateName };
