# ConstructAI ERP - Setup Guide

## Prerequisites
- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **SQLite**: (Default database to simplify prototype setup, manageable via Prisma)

## 1. Installation

### Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed  # Populates initial Admin/Manager users & finance data
npm run dev
```
*Server runs on `http://localhost:5000`*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

## 2. Default Login Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `alice@construct.ai` | `password123` |
| **Finance Manager** | `bob@construct.ai` | `password123` |

## 3. Configuration
The `.env` files are pre-configured for local testing.
- `server/.env`: Contains `DATABASE_URL="file:./dev.db"` and `JWT_SECRET`.
- Root `.env`: Contains `VITE_API_URL`.

## 4. Troubleshooting
- **CORS Errors**: Ensure the backend is running on port 3001. The frontend proxies requests to this port.
- **Database Errors**: Run `npx prisma migrate reset` in the server folder to fully reset and re-seed the database if data acts corrupted.
