# 1701 Squadron — Uniform Inventory System
# Setup Guide

---

## What's Included

```
1701_uniform/
├── backend/              # FastAPI Python backend (API)
│   ├── main.py           # App entry point
│   ├── models.py         # Database models
│   ├── schemas.py        # API data shapes
│   ├── database.py       # DB connection
│   ├── seed.py           # Populates items, sizes, kit list, admin user
│   ├── requirements.txt
│   ├── .env.example      # Copy this to .env and fill in your DB details
│   ├── routers/          # API routes (auth, cadets, stock, transactions...)
│   ├── logic/            # Business logic (issue, return)
│   └── utils/            # Helpers (JWT, hashing, audit, auth)
│
└── frontend/
    └── index.html        # Full web app — open in browser or serve as static file
```

---

## Requirements

- Python 3.11+
- MySQL 8.0+
- A modern web browser

---

## Step 1 — Create the MySQL database

Log into MySQL and run:

```sql
CREATE DATABASE 1701_uniform_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DB=1701_uniform_inventory

SECRET_KEY=pick-a-long-random-string-here
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Step 3 — Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## Step 4 — Run the seed script

This creates all tables, populates every uniform item and size, sets up the standard kit list, and creates the first admin user.

```bash
python seed.py
```

Default admin login:
- **Username:** `admin`
- **Password:** `Password1!`
⚠️ Change this immediately after first login.

---

## Step 5 — Start the backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
Interactive API docs at `http://localhost:8000/docs`

---

## Step 6 — Open the web app

Open `frontend/index.html` directly in a browser, or serve it with any static file server:

```bash
# Simple option (Python built-in)
cd frontend
python -m http.server 3000
# Then visit http://localhost:3000
```

The app connects to `http://localhost:8000` by default.
To change this (e.g. for deployment), edit the `API_BASE` line at the top of `index.html`.

---

## Running on your squadron network

To let other staff access the system from their own devices on the same WiFi:

1. Find your computer's local IP (e.g. `192.168.1.50`)
2. Start the backend with: `uvicorn main:app --host 0.0.0.0 --port 8000`
3. In `index.html`, change `API_BASE` to `http://192.168.1.50:8000`
4. Serve the frontend: `python -m http.server 3000 --bind 0.0.0.0`
5. Other staff visit `http://192.168.1.50:3000` in their browser

---

## User Roles

| Role  | Can Do |
|-------|--------|
| Staff | Login, issue kit, process returns, view cadets, view stock, view audit log |
| Admin | Everything above + add stock, manage users, reset passwords |

New staff accounts are created by an admin. Default password is `Password1!` — they should change it on first login via the API at `POST /auth/change-password`.

---

## Key Features

- **Issue kit** to a cadet — stock deducted automatically
- **Return kit** with serviceable/unserviceable condition
  - Serviceable → back into stock
  - Unserviceable → warning shown, NOT returned to stock
- **Duplicate issue protection** — if a cadet already has an item, a reason is required
- **Standard kit list** — dashboard shows every cadet missing required kit
- **Full audit log** — every action logged with who did it and when
- **Per-cadet history** — full issue and return history per cadet
- **Stock check** — see quantity for any item/size combination
- **Low stock alerts** — dashboard flags anything at 3 or below
- **Admin stock management** — bulk add or adjust stock levels

---

## API Reference

Full interactive docs available at `http://localhost:8000/docs` when the server is running.

Key endpoints:
```
POST /auth/login              — Log in
GET  /dashboard/              — Dashboard overview + missing kit
GET  /cadets/                 — List cadets (supports ?search=)
POST /cadets/                 — Add cadet
GET  /cadets/{id}/history     — Full kit history for a cadet
POST /transactions/issue      — Issue item to cadet
POST /transactions/return     — Return item from cadet
GET  /stock/                  — All stock levels
POST /stock/adjust            — Adjust stock (admin)
POST /stock/bulk-adjust       — Bulk adjust stock (admin)
GET  /items/{id}/sizes/{sid}/stock — Check specific size in stock
GET  /audit/                  — Full audit log
GET  /audit/cadet/{id}        — Audit log for one cadet
POST /users/                  — Create staff user (admin)
```

---

## Mobile App

A React Native mobile app is the next phase of this project.
It will connect to the same backend API and support:
- Quick cadet lookup by service number
- Issue and return kit on parade nights
- Dashboard overview
- Works on iOS and Android

---

## Troubleshooting

**"Could not connect to database"**
→ Check your `.env` file credentials and that MySQL is running.

**"Module not found"**
→ Make sure you ran `pip install -r requirements.txt` inside the `backend/` folder.

**CORS errors in browser**
→ Make sure the backend is running and `API_BASE` in `index.html` matches the correct address.

**Login returns 401**
→ Run `python seed.py` to make sure the admin user was created.
