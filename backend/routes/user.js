// routes/user.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByUsername, deleteUser, updateUser } = require('../db');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Create a new user (POST /user)
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await createUser(username, password);
    res.status(201).json({ id: user.id });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
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

// Update user password (PUT /user/:id) - Users can update their own password, admins can update anyone's
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
// Users can delete their own account, and admins can delete any account.
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  // Check if the user is deleting their own account or is an admin
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
  const user = await findUserByUsername(username);
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Logout user (POST /logout)
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;

