const express = require('express');
const { body, param } = require('express-validator');
const pool = require('../db');
const validate = require('../middleware/validate');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin); // every route below is admin-only, checked on the server

const idRule = param('id').isInt({ min: 1 }).withMessage('Invalid claim id.');
const reasonRule = body('reason').trim().isLength({ min: 3, max: 500 }).withMessage('Record a reason of 3 to 500 characters.');

router.get('/claims', async (req, res, next) => {
  try {
    const status = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : null;
    const [claims] = await pool.query(
      `SELECT c.id, c.report_id, r.title AS report_title, r.private_details, u.full_name AS claimant_name,
              c.evidence, c.status, c.admin_reason, c.returned_at, c.created_at
         FROM claims c JOIN reports r ON r.id = c.report_id JOIN users u ON u.id = c.claimant_id
        ${status ? 'WHERE c.status = ?' : ''} ORDER BY c.created_at DESC`, status ? [status] : []);
    res.json({ claims });
  } catch (err) { next(err); }
});

async function loadClaim(id) {
  const [rows] = await pool.query(
    `SELECT c.id, c.report_id, c.status, c.returned_at, r.status AS report_status
       FROM claims c JOIN reports r ON r.id = c.report_id WHERE c.id = ?`, [id]);
  return rows[0];
}

async function decide(req, res, next, decision) {
  try {
    const claim = await loadClaim(req.params.id);
    if (!claim) return res.status(404).json({ error: 'This claim does not exist.' });
    if (claim.status !== 'pending') return res.status(409).json({ error: 'This claim has already been reviewed.' });
    if (claim.report_status === 'returned') return res.status(409).json({ error: 'This item has already been returned.' });
    try {
      await pool.query(
        'UPDATE claims SET status = ?, admin_reason = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
        [decision, req.body.reason, req.user.id, claim.id]);
    } catch (err) {
      // The unique index guarantees one approved claim per item, even with two admins clicking at once.
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Another claim for this item is already approved.' });
      throw err;
    }
    res.json({ message: `Claim ${decision}.` });
  } catch (err) { next(err); }
}
router.post('/claims/:id/approve', [idRule, reasonRule], validate, (req, res, next) => decide(req, res, next, 'approved'));
router.post('/claims/:id/reject', [idRule, reasonRule], validate, (req, res, next) => decide(req, res, next, 'rejected'));

router.post('/claims/:id/confirm-return', [idRule], validate, async (req, res, next) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const [rows] = await conn.query(
      'SELECT id, report_id, status, returned_at FROM claims WHERE id = ? FOR UPDATE', [req.params.id]);
    const claim = rows[0];
    if (!claim) { await conn.rollback(); return res.status(404).json({ error: 'This claim does not exist.' }); }
    if (claim.status !== 'approved') { await conn.rollback(); return res.status(409).json({ error: 'Only an approved claim can be confirmed as collected.' }); }
    if (claim.returned_at) { await conn.rollback(); return res.status(409).json({ error: 'This return was already confirmed.' }); }
    await conn.query('UPDATE claims SET returned_at = NOW() WHERE id = ?', [claim.id]);
    await conn.query("UPDATE reports SET status = 'returned' WHERE id = ?", [claim.report_id]);
    await conn.query(
      "UPDATE claims SET status = 'rejected', admin_reason = 'The item was returned to another claimant.', reviewed_by = ?, reviewed_at = NOW() WHERE report_id = ? AND status = 'pending'",
      [req.user.id, claim.report_id]);
    await conn.commit();
    res.json({ message: 'Return confirmed.' });
  } catch (err) {
    if (conn) await conn.rollback();
    next(err);
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
