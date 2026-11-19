const express = require('express');
const { body, param } = require('express-validator');
const pool = require('../db');
const validate = require('../middleware/validate');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const { CATEGORIES, LOCATIONS } = require('../constants');

const router = express.Router();
// PUBLIC columns only: private_details is never selected here.
const PUBLIC = 'id, user_id, type, title, category, description, event_date, location, photo_url, status, created_at';
const today = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Kampala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(part => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const rules = [
  body('type').isIn(['lost', 'found']).withMessage('Choose whether the item was lost or found.'),
  body('title').trim().isLength({ min: 3, max: 120 }).withMessage('Enter a short title of 3 to 120 characters.'),
  body('category').isIn(CATEGORIES).withMessage('Choose a category from the list.'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Describe the item in 10 to 2000 characters.'),
  body('event_date').isISO8601({ strict: true }).withMessage('Enter a valid date.').bail()
    .custom((v) => v <= today()).withMessage('The date cannot be in the future.'),
  body('location').isIn(LOCATIONS).withMessage('Choose a campus location from the list.'),
  body('photo_url').optional({ values: 'null' }).trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).isLength({ max: 500 })
    .withMessage('Enter a web address starting with http:// or https://, or leave this empty.'),
  body('private_details').optional({ values: 'null' }).trim().isLength({ max: 2000 }).withMessage('Private details are too long (2000 characters maximum).'),
  body('private_details').custom((v, { req }) => req.body.type !== 'found' || (v && v.trim().length >= 3))
    .withMessage('Add a detail only the owner would know. It stays private.'),
];
const idRule = param('id').isInt({ min: 1 }).withMessage('Invalid item id.');

// GET /api/reports  (public search)
router.get('/', async (req, res, next) => {
  try {
    const { q, type, category, location, date, status } = req.query;
    const where = [];
    const args = [];
    if (q && String(q).trim()) {
      where.push('(title LIKE ? OR description LIKE ?)');
      const like = `%${String(q).trim().slice(0, 100)}%`;
      args.push(like, like);
    }
    if (['lost', 'found'].includes(type)) { where.push('type = ?'); args.push(type); }
    if (['open', 'returned'].includes(status)) { where.push('status = ?'); args.push(status); }
    if (category) { where.push('category = ?'); args.push(String(category)); }
    if (location) { where.push('location = ?'); args.push(String(location)); }
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) { where.push('event_date = ?'); args.push(date); }
    const [reports] = await pool.query(
      `SELECT ${PUBLIC} FROM reports ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT 200`, args);
    res.json({ reports });
  } catch (err) { next(err); }
});

// GET /api/reports/mine  (declared before /:id)
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const [reports] = await pool.query(
      `SELECT ${PUBLIC}, private_details FROM reports WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id]);
    res.json({ reports });
  } catch (err) { next(err); }
});

// GET /api/reports/:id
router.get('/:id', optionalAuth, [idRule], validate, async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT ${PUBLIC}, private_details FROM reports WHERE id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'This item does not exist or was removed.' });
    const report = rows[0];
    const canSeePrivate = req.user && (req.user.role === 'admin' || req.user.id === report.user_id);
    if (!canSeePrivate) delete report.private_details; // enforced here, not only in the UI
    if (req.user && req.user.id !== report.user_id) {
      const [c] = await pool.query(
        'SELECT status, admin_reason FROM claims WHERE report_id = ? AND claimant_id = ? ORDER BY id DESC LIMIT 1',
        [report.id, req.user.id]);
      if (c.length) report.my_claim = c[0];
    }
    res.json({ report });
  } catch (err) { next(err); }
});

// POST /api/reports
router.post('/', requireAuth, rules, validate, async (req, res, next) => {
  try {
    const b = req.body;
    const [r] = await pool.query(
      `INSERT INTO reports (user_id, type, title, category, description, private_details, event_date, location, photo_url)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [req.user.id, b.type, b.title, b.category, b.description, b.type === 'found' ? b.private_details : null, b.event_date, b.location, b.photo_url || null]);
    res.status(201).json({ report: { id: r.insertId } });
  } catch (err) { next(err); }
});

// PUT /api/reports/:id  (owner only, open reports only)
router.put('/:id', requireAuth, [idRule, ...rules], validate, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT user_id, status, type FROM reports WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'This item does not exist or was removed.' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'You can only edit your own reports.' });
    if (rows[0].status === 'returned') return res.status(409).json({ error: 'This item has been returned, so its report can no longer be edited.' });
    const b = req.body;
    if (b.type !== rows[0].type) return res.status(400).json({ error: 'You cannot change a report from lost to found.', fields: { type: 'The type cannot be changed.' } });
    await pool.query(
      `UPDATE reports SET title=?, category=?, description=?, private_details=?, event_date=?, location=?, photo_url=? WHERE id=?`,
      [b.title, b.category, b.description, b.type === 'found' ? b.private_details : null, b.event_date, b.location, b.photo_url || null, req.params.id]);
    res.json({ report: { id: Number(req.params.id) } });
  } catch (err) { next(err); }
});

// POST /api/reports/:id/claims
router.post('/:id/claims', requireAuth, [idRule,
  body('evidence').trim().isLength({ min: 10, max: 2000 }).withMessage('Explain why this is yours in 10 to 2000 characters.')],
validate, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, user_id, type, status FROM reports WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'This item does not exist or was removed.' });
    const r = rows[0];
    if (req.user.role === 'admin') return res.status(403).json({ error: 'Administrators review claims and cannot make them.' });
    if (r.user_id === req.user.id) return res.status(403).json({ error: 'You reported this item as found, so you cannot claim it.' });
    if (r.type !== 'found') return res.status(400).json({ error: 'Only found items can be claimed.' });
    if (r.status === 'returned') return res.status(409).json({ error: 'This item has already been returned. New claims are closed.' });
    const [approved] = await pool.query("SELECT id FROM claims WHERE report_id = ? AND status = 'approved'", [r.id]);
    if (approved.length) return res.status(409).json({ error: 'A claim for this item has already been approved. New claims are closed.' });
    const [mine] = await pool.query("SELECT id FROM claims WHERE report_id = ? AND claimant_id = ? AND status = 'pending'", [r.id, req.user.id]);
    if (mine.length) return res.status(409).json({ error: 'You already have a claim waiting for review on this item.' });
    await pool.query('INSERT INTO claims (report_id, claimant_id, evidence) VALUES (?,?,?)', [r.id, req.user.id, req.body.evidence]);
    res.status(201).json({ message: 'Your claim was sent for review.' });
  } catch (err) { next(err); }
});

module.exports = router;
