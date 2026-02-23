# 🛠️ Development Installation Guide

Welcome! This guide will help you set up the **TikTok Info API** on your local machine for development.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1.  **Bun**: The incredibly fast JavaScript runtime.
    - [Install Bun](https://bun.sh/)
2.  **Redis**: Required for the background queue system.
    - [Install Redis](https://redis.io/docs/getting-started/) (Make sure it is running!)

---

## 🚀 Step-by-Step Setup

### 1. Clone & Enter Project
Open your terminal and navigate to the project folder:
```bash
cd hono-tiktok-info-api
```

### 2. Install Dependencies
Download all the necessary code libraries:
```bash
bun install
```

### 3. Environment Configuration
The app needs a `.env.dev` file to know its settings. Use the template provided:
```bash
cp .env.example .env.dev
```
> [!NOTE]
> For simple development, the default values in `.env.example` will work perfectly with SQLite and locally running Redis.

### 4. Database Setup
This app uses SQLite for development. You need to create the tables:
```bash
bun run migrate:sqlite
```

### 5. Create Initial Client (Seeding)
To use the API, you need an "Account" (Client ID). Create a default one:
```bash
bun run seed:sqlite
```
*This will create a default client with `clientId: scraper` and `clientSecret: scraper_secret`.*

---

## 🏃 Running the Application

To run the full system, you need **two terminal windows** open:

### Terminal 1: The API Server
This handles the incoming requests.
```bash
bun run dev
```

### Terminal 2: The Background Worker
This handles the bulk TikTok scraping tasks.
```bash
bun run worker
```

---

## ✅ Verification
Once both are running:
1.  Open your browser or Postman.
2.  Try hitting `http://localhost:8080/api/tiktok/profiles` (Requires [M2M Authentication](../api/client/AUTHORIZATION.md)).

---

## 💡 Pro-Tips
- **Logs**: Check the console in Terminal 1 and 2 to see what the app is doing in real-time.
- **SQLite Database**: You can find your database file at `./storages/database/sqlite/dev.db`.
- **Redis**: If the app crashes with a "Connection Refused" error, make sure your Redis server is started!
