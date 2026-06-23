const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Auto-seed default admin if no users exist
// NOTE: User model pre('save') handles hashing — do NOT hash manually here
const seedAdmin = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    console.log('Default admin created: admin / admin123');
  }
};
seedAdmin().catch(console.error);

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const user = await User.findOne({ username: username.trim() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'easttop_secret',
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/register',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Invalid role')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username, password, role } = req.body;
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ error: 'Username already exists' });
      const user = await User.create({ username, password, role });
      res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Protect routes with JWT validation
router.use(authMiddleware);

// Example protected route
router.get('/profile', async (req, res) => {
  res.json({ message: `Welcome ${req.user.username}`, role: req.user.role });
});

module.exports = router;
