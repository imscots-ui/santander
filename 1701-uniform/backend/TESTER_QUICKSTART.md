# 1701 Squadron Uniform Inventory — Tester Quick Start

## What You Need Installed

- **Python 3.9** — https://www.python.org/downloads/release/python-3913/
- **MySQL** — https://dev.mysql.com/downloads/mysql/
- A terminal (Mac: Terminal app, Windows: Command Prompt or PowerShell)

---

## Step 1 — Create the Database

Open MySQL and run:

```sql
CREATE DATABASE 1701_uniform_inventory;
```

In MySQL Workbench, paste that line and click Run (⚡).

---

## Step 2 — Configure Your Database Credentials

In the `backend` folder, copy `.env.example` and rename it to `.env`:

```
backend/.env.example  →  backend/.env
```

Open `backend/.env` and fill in your MySQL password:

```
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_PASSWORD_HERE
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DB=1701_uniform_inventory
SECRET_KEY=1701johnstonesquadron2024secretkey
```

---

## Step 3 — Install Python Packages

Open a terminal, navigate to the `backend` folder and run:

**Mac:**
```bash
cd ~/path/to/1701_uniform/backend
pip3 install -r requirements.txt
```

**Windows:**
```bash
cd C:\path\to\1701_uniform\backend
pip install -r requirements.txt
```

---

## Step 4 — Start the Backend

**Mac:**
```bash
cd ~/path/to/1701_uniform/backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Windows:**
```bash
cd C:\path\to\1701_uniform\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO: Application startup complete.
```

Keep this terminal open.

---

## Step 5 — Start the Frontend

Open a **second** terminal and run:

**Mac:**
```bash
cd ~/path/to/1701_uniform/frontend
python3 -m http.server 3001
```

**Windows:**
```bash
cd C:\path\to\1701_uniform\frontend
python -m http.server 3001
```

Keep this terminal open too.

---

## Step 6 — Open the App

Go to `http://localhost:3001` in Chrome.

You should see the **WHO ARE YOU?** screen.

---

## Default Login

- Select **Admin User** from the list
- This gives you full access to set up staff, cadets and stock

---

## First Time Setup

1. **Add staff** — Admin → Manage Staff → Add Staff Member
2. **Add cadets** — Admin → Manage Cadets → Add Cadet  
3. **Add stock** — Admin → Bulk Add Stock
4. **Add badge stock** — Home → Badge Tracker → each category → Add Stock

---

## Troubleshooting

**"Cannot connect" error in browser**
→ The backend terminal has crashed. Check it for error messages and restart.

**Database connection error on startup**
→ Check your `.env` file — password or username is wrong.

**Blank white page**
→ JavaScript error. Open Chrome DevTools (F12) → Console tab and send the error message.

**Port already in use**
→ Something else is using port 8000 or 3001. Change the port number in the start commands.
