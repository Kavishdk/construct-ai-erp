# 🏗️ ConstructAI ERP

Hi there! Welcome to **ConstructAI ERP**, a prototype Enterprise Resource Planning system designed specifically for the construction industry. 

This project was built to demonstrate how a modern full-stack application handles complex business logic like financial ledgers, project risk analysis, and AI-driven forecasting.

---

## 🚀 Features at a Glance

*   **📊 Executive Dashboard**: Get a birds-eye view of your company's health with real-time KPI cards and alerts.
*   **💰 Finance Module**: A robust double-entry General Ledger system that handles Invoices, Payments, and automatic currency conversion.
*   **🤖 AI Insights**: Smart logic that analyzes your project's budget vs. progress to predict risks and forecast cash flow trends.
*   **🔒 Secure Access**: Role-based access control (RBAC) ensuring only the right people see sensitive data.

---

## 🛠️ Tech Stack

We used a modern, industry-standard stack to build this:

*   **Frontend**: React (v19), TypeScript, TailwindCSS for styling, and Recharts for analytics.
*   **Backend**: Node.js with Express.
*   **Database**: SQLite (via Prisma ORM) for easy local development (ready for PostgreSQL in production).
*   **Authentication**: JWT (JSON Web Tokens) with secure password hashing.

---

## 🏁 Getting Started

Follow these steps to get the system running on your local machine.

### 1. Prerequisites
Make sure you have **Node.js** (v18 or higher) and **Git** installed on your computer.

### 2. Clone the Repository
```bash
git clone https://github.com/Kavishdk/construct-ai-erp.git
cd construct-ai-erp
```

### 3. Setup the Backend (Server)

The backend handles the API, database, and AI logic.

```bash
cd backend
npm install
```

**Database Setup:**
You need to initialize the database and load some sample data so the app isn't empty.
```bash
# Create the database schema
npx prisma migrate dev --name init

# Seed the database with sample users and accounts
npx prisma db seed
```

**Environment Variables:**
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_key_here"
GEMINI_API_KEY="your_google_gemini_key_here" # Optional, for AI features
```

**Start the Server:**
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 4. Setup the Frontend (Client)

The frontend is the visual interface you'll interact with. Open a new terminal window for this.

```bash
cd frontend
npm install
```

**Environment Variables:**
Create a `.env.local` file in the `frontend` folder if you want to configure specific API keys manually, though the defaults usually work out of the box for dev.

**Start the Client:**
```bash
npm run dev
# App will open at http://localhost:3000
```

---

## 🔑 Default Login Credentials

We've pre-created a user for you to test the admin features:

*   **Email**: `alice@construct.ai`
*   **Password**: `password123`

---

## 🌍 Deployment

Ready to go live? We have a detailed guide for deploying this to the web.
👉 **[Read the Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)**

---

## 🤝 Contributing

Found a bug? Want to add a feature? Feel free to open an issue or submit a Pull Request.

Happy Coding! 🧱
