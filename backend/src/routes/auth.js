const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const pool = require('../db');
const validate = require('../middleware/validate');
const { createSession, destroySession, requireAuth } = require('../middleware/auth');

const router = express.Router();

const registerRules = [
  body('full_name').trim().isLength({ min: 2, max: 100 })
    .withMessage('Enter your full name (2 to 100 characters).'),
  body('email').trim().toLowerCase()
    .isEmail().withMessage('Enter a valid email address, for example name@example.com.')
    .bail()
    .isLength({ max: 150 }).withMessage('That email is too long (150 characters maximum).'),
  body('password').isLength({ min: 8, max: 72 })
    .withMessage('Choose a password of 8 to 72 characters.'),
];

const loginRules = [
  body('email').trim().toLowerCase().isEmail()
    .withMessage('Enter a valid email address, for example name@example.com.'),
  body('password').notEmpty().withMessage('Enter your password.'),
];

// POST /api/auth/register  (role is ALWAYS "student": nobody can self-register as admin)
router.post('/register', registerRules, validate, async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        error: 'An account with this email already exists. Try logging in instead.',
        fields: { email: 'This email is already registered.' },
      });
    }
    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'student')",
      [full_name, email, password_hash]
    );
    const token = await createSession(result.insertId);
    res.status(201).json({
      token,
      user: { id: result.insertId, full_name, email, role: 'student' },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', loginRules, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?',
      [email]
    );
    // Same message for "unknown email" and "wrong password": do not reveal which accounts exist.
    const genericError = { error: 'Incorrect email or password. Check both and try again.' };
    if (rows.length === 0) return res.status(401).json(genericError);

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json(genericError);

    const token = await createSession(user.id);
    res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout  (deletes the session: the token is useless afterwards)
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await destroySession(req.token);
    res.json({ message: 'You have been logged out.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (who am I? used by the frontend on page load)
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
