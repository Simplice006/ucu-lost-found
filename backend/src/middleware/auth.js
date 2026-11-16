// Authentication and authorisation middleware.
// Sessions are stored server-side: logout deletes the row, which ends access immediately.
const crypto = require('crypto');
const pool = require('../db');

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Creates a session and returns the RAW token (sent to the browser once; only its hash is stored).
async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const days = Number(process.env.SESSION_DAYS || 7);
  await pool.query(
    'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))',
    [userId, sha256(token), days]
  );
  return token;
}

function readToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// Looks up the user for a raw token. Returns null if the token is unknown or expired.
async function findUserByToken(token) {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > NOW()`,
    [sha256(token)]
  );
  return rows[0] || null;
}

// Requires a valid, unexpired session. Sets req.user and req.token.
async function requireAuth(req, res, next) {
  try {
    const token = readToken(req);
    if (!token) return res.status(401).json({ error: 'Please log in to continue.' });

    const user = await findUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Your session has ended. Please log in again.' });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

// Like requireAuth but never rejects: req.user stays undefined for visitors who are logged out.
// Useful for public pages that show a bit more to the owner or an admin.
async function optionalAuth(req, res, next) {
  try {
    const token = readToken(req);
    if (token) {
      const user = await findUserByToken(token);
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

// Must be used AFTER requireAuth. Enforced on the backend, not only hidden in the UI.
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'This action is restricted to administrators.' });
  }
  next();
}

async function destroySession(token) {
  await pool.query('DELETE FROM sessions WHERE token_hash = ?', [sha256(token)]);
}

module.exports = { createSession, destroySession, requireAuth, optionalAuth, requireAdmin };
