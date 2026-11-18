# Database setup (every teammate, once)

1. Start MySQL (XAMPP "MySQL" > Start, or MySQL Workbench / the Windows service).
2. In `backend/`, copy `.env.example` to `.env` and set `DB_USER` and `DB_PASSWORD`
   (XAMPP default: user `root`, empty password -> `DB_PASSWORD=`).
3. Create the tables:

   ```
   cd backend
   npm install
   npm run db:init
   ```

   It creates the database named in `DB_NAME` (default `ucu_lost_found`) and all tables.
   Re-running it erases the data in those tables.
4. Optional sample accounts: set `SEED_PASSWORD` in `.env`, then `npm run seed`.

Without Node you can also run `mysql -u root -p < database/schema.sql`.
Needs MySQL 5.7+/8 or MariaDB 10.2+ (the "one approved claim per item" rule uses a stored generated column).
