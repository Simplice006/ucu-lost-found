const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/claims/mine : only the logged-in student's own claims
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const [claims] = await pool.query(
      `SELECT c.id, c.report_id, r.title AS report_title, c.evidence, c.status, c.admin_reason, c.returned_at, c.created_at
         FROM claims c JOIN reports r ON r.id = c.report_id
        WHERE c.claimant_id = ? ORDER BY c.created_at DESC`, [req.user.id]);
    res.json({ claims });
  } catch (err) { next(err); }
});
module.exports = router;
