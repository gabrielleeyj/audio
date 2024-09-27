const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByUsername, deleteUser, updateUser, listUsers } = require('../db/db');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Create a new user (POST /user)
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    await createUser(username, password);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Get list of users (GET /users)
// Only admins should be allowed to view all users
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const users = await listUsers();
  if (!users) return res.status(404).json({ error: 'No users found' });
  res.json({ users });
});

// Get user details (GET /user/:username)
router.get('/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  if (req.user.username !== username && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access denied' });
  }

  const user = await findUserByUsername(username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, role: user.role });
});

// Update user password (PUT /user/:id)
// Users can update their own password, but admins can update any user's password
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Check if user is allowed to update their own account or admin
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Forbidden: Access denied' });
  }

  try {
    await updateUser(id, password);
    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (DELETE /user/:id)
// Only admins can delete any account, but users can delete their own account
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
  }

  try {
    await deleteUser(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Login user (POST /login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("req.body", req.body);
  const user = await findUserByUsername(username);
  console.log("finding user", user);
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token: token });
});

// Logout user (POST /logout)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;

