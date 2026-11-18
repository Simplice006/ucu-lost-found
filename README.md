# UCU Campus Lost and Found System

A responsive web application where UCU students report lost or found items,
search listings, submit private ownership claims, and where an administrator
reviews claims and confirms returns.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js and Express
- Database: MySQL

## Prerequisites
- Node.js (LTS version) and npm
- MySQL (local) or a TiDB Cloud database
- Git

## Installation
1. Clone the repository:
   git clone https://github.com/Simplice006/ucu-lost-found.git
2. Install backend dependencies:
   cd backend
   npm install
3. Install frontend dependencies:
   cd ../frontend
   npm install

## Configuration
1. In the backend folder, copy `.env.example` to `.env`.
2. Fill in your own database values. Never commit `.env`.

## Database Setup
(To be completed from database/README.md)

## Running the Application
- Backend: `cd backend`, then `npm run dev`
- Frontend: `cd frontend`, then `npm run dev`
- Open http://localhost:5173

## Team
See CONTRIBUTORS.md