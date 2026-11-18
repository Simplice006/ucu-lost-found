// Creates FICTIONAL sample accounts. Passwords come from the environment, never from Git.
// Usage: set SEED_PASSWORD (and optionally SEED_ADMIN_EMAIL) in .env, then run `npm run seed`.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/db');

async function main() {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8) {
    console.error('Set SEED_PASSWORD (8+ characters) in your .env file first.');
    process.exit(1);
  }
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@example.test').toLowerCase();
  const hash = await bcrypt.hash(password, 12);

  const users = [
    ['Fictional Admin', adminEmail, 'admin'],
    ['Okello Fictional', 'okello@example.test', 'student'],
    ['Namusoke Fictional', 'namusoke@example.test', 'student'],
    ['Third Student Fictional', 'student3@example.test', 'student'],
  ];

  for (const [name, email, role] of users) {
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role),
                               password_hash = VALUES(password_hash)`,
      [name, email, hash, role]
    );
    console.log(`ready: ${email} (${role})`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});