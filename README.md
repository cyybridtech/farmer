# 🌾 AgriConnect — Farmer-to-Buyer Marketplace (Ghana 🇬🇭)

A full-stack web application that connects farmers directly with buyers and displays real-time market prices.

## 📁 Project Structure

```
├── backend/          # Node.js + Express API server (JavaScript)
│   ├── db/
│   │   ├── index.js      # MySQL database connection (Drizzle ORM)
│   │   ├── schema.js     # Database table definitions
│   │   └── seed.js       # Sample data seeder
│   ├── server.js         # Express API entrypoint
│   ├── .env              # Backend environment variables
│   ├── drizzle.config.json
│   └── package.json
│
└── frontend/         # React + TypeScript (Vite)
    ├── src/
    │   ├── components/   # UI components
    │   ├── App.tsx       # Main application page
    │   ├── index.css     # Global styles
    │   └── main.tsx
    ├── vite.config.ts    # Vite config (with API proxy to backend)
    └── package.json
```

---

## 🚀 Running the App Locally

### Prerequisites
- **Node.js** 20+
- **MySQL** (XAMPP, MySQL 8+ or MariaDB 10.4+) running on port 3306

### 1. Start MySQL
Open XAMPP Control Panel and start **MySQL**, or start it from Services.

### 2. Start the Backend
```bash
cd backend
npm install
npm run db:push   # Create database tables
npm run db:seed   # Load sample data
npm run start     # Start Express server on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev       # Start Vite app on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Demo Login Accounts

Login via mobile number. Use these pre-seeded accounts:

| Role   | Country | Number        | Name          |
|--------|---------|---------------|---------------|
| Farmer | 🇬🇭 +233 | `244123456`   | Kwame Mensah  |
| Buyer  | 🇬🇭 +233 | `244567890`   | Yaw Adjei     |

---

## 🛠️ Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 19 + TypeScript, Vite 8            |
| Backend   | Node.js + Express (JavaScript)           |
| Database  | MySQL via Drizzle ORM (`mysql2`)         |
| Styling   | Tailwind CSS + inline styles             |

---

## 📡 API Endpoints (Backend on port 5000)

| Method | Path                | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/health`       | Health check             |
| GET    | `/api/categories`   | Product categories       |
| GET    | `/api/market-prices`| Live market price board  |
| GET    | `/api/products`     | List/filter products     |
| POST   | `/api/products`     | List a new product       |
| GET    | `/api/orders`       | List orders              |
| POST   | `/api/orders`       | Place an order           |
| GET    | `/api/users`        | List users               |
| POST   | `/api/users`        | Register a user          |
