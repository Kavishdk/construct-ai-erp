# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
- **POST** `/auth/login`
    - Body: `{ email, password }`
    - Returns: `{ token, user }`
- **POST** `/auth/register`
    - Body: `{ email, password, role, name }`

## Finance Module (@requires Auth)

### General Ledger
- **GET** `/finance/accounts` - List all GL accounts.
- **GET** `/finance/journal-entries` - List journal history.
- **POST** `/finance/journal-entries`
    - Body: `{ date, description, lines: [{ accountId, debit, credit }] }`
- **GET** `/finance/balance-sheet` - Get Assets/Liabilities/Equity totals.
- **GET** `/finance/profit-loss` - Get Revenue/Expense totals.

### Accounts Receivable / Payable
- **GET** `/finance/invoices` - List all invoices.
- **POST** `/finance/invoices`
    - Body: `{ vendorName, amount, currency, issueDate, dueDate, projectId? }`
    - *Note: Automatically converts foreign currency to USD for Ledger.*
- **POST** `/finance/payments`
    - Body: `{ invoiceId, amount, date, method }`
    - *Note: Updates Invoice status and Ledger (Dr Cash, Cr AR).*

### Dashboard & Analytics
- **GET** `/finance/dashboard` - Get high-level finance KPIs.
- **GET** `/finance/forecast` - Get AI-driven Cash Flow predictions.
- **GET** `/finance/exchange-rates` - Get supported currencies.

## Projects Module
- **GET** `/projects` - List projects with progress and budget stats.
- **GET** `/projects/:id` - Get details including risk score.

## Administration
- **GET** `/admin/users` - List system users.
- **POST** `/admin/users` - Create new internal user.
- **GET** `/admin/audit-logs` - System audit trail (Logins, Financial Actions).
