# Deployment Guide

This guide explains how to deploy the **ConstructAI ERP** system using **Render.com** (recommended for easy Node.js/React hosting).

## Prerequisites
1.  **GitHub Account**: Ensure your code is pushed to GitHub (you have already done this).
2.  **Render Account**: Sign up at [render.com](https://dashboard.render.com/).

---

## Part 1: Deploy the Backend (Web Service)

1.  **Create Service**:
    *   In Render Dashboard, click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`construct-ai-erp`).
2.  **Configuration**:
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npx prisma migrate deploy && npx prisma db seed && npm run start`
        *   *Note: This command ensures dependencies are installed, the database is created/migrated, seeded with initial data, and then the server starts.*
    *   **Plan**: Free
3.  **Environment Variables**:
    *   Add the following under "Environment":
        *   `JWT_SECRET`: (Generate a random string, e.g., `mysecureprojectsecret`)
        *   `GEMINI_API_KEY`: (Your Google Gemini API Key)
        *   `DATABASE_URL`: `file:./dev.db` (Default SQLite configuration)
4.  **Deploy**: Click "Create Web Service".
5.  **Copy URL**: Once live, copy the service URL (e.g., `https://construct-erp-api.onrender.com`). You will need this for the frontend.

*Warning: On the Free Tier of Render, the SQLite database file will be reset every time the server restarts (ephemeral filesystem). For a permanent database, use Render's PostgreSQL database service.*

---

## Part 2: Deploy the Frontend (Static Site)

1.  **Create Service**:
    *   In Render Dashboard, click **New +** -> **Static Site**.
    *   Connect the same GitHub repository.
2.  **Configuration**:
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
3.  **Environment Variables**:
    *   Add the following:
        *   `VITE_API_URL`: Paste your Backend URL from Part 1 using the `/api` suffix.
            *   Example: `https://construct-erp-api.onrender.com/api` (Make sure to include `/api` if that's how your routes are set up).
4.  **Deploy**: Click "Create Static Site".

---

## Part 3: Verification

1.  Visit your new Frontend URL.
2.  Log in with the seed credentials: `alice@construct.ai` / `password123`.
3.  Check the "Finance Dashboard" to see if data loads from the backend.
