"""
Demo data seed — run after seed.py to populate a realistic-looking 1701 database.
Adds staff, cadets (with full kit issued), stock levels, badges, and feedback.
Works with both SQLite and MySQL.
Usage: python demo_seed.py
"""
import sys, os, random
from datetime import datetime, timedelta
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine
from sqlalchemy import text
from utils.hashing import hash_password

db = SessionLocal()
SQLITE = str(engine.url).startswith("sqlite")

def now_offset(days=0, hours=0):
    dt = datetime.utcnow() - timedelta(days=days, hours=hours)
    return dt.strftime("%Y-%m-%d %H:%M:%S")

# ── CREATE EXTRA TABLES (SQLite-compatible) ─────────────────────────────────

print("Creating extra tables if needed...")
with engine.connect() as conn:
    if SQLITE:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                submitted_by_id INTEGER NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                category VARCHAR(50) DEFAULT 'General',
                status VARCHAR(20) DEFAULT 'open',
                admin_reply TEXT,
                replied_by_id INTEGER,
                replied_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                subcategory VARCHAR(100),
                description VARCHAR(500),
                is_active INTEGER DEFAULT 1,
                routine_stock INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_stock (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                badge_item_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_issued (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                badge_item_id INTEGER NOT NULL,
                cadet_id INTEGER NOT NULL,
                issued_by_id INTEGER NOT NULL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                returned INTEGER DEFAULT 0,
                returned_at DATETIME,
                notes VARCHAR(500)
            )
        """))
    else:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                submitted_by_id INT NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                category VARCHAR(50) DEFAULT 'General',
                status VARCHAR(20) DEFAULT 'open',
                admin_reply TEXT,
                replied_by_id INT,
                replied_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                subcategory VARCHAR(100),
                description VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                routine_stock BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_item_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 0
            )
        """))
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS badge_issued (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_item_id INT NOT NULL,
                cadet_id INT NOT NULL,
                issued_by_id INT NOT NULL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                returned BOOLEAN DEFAULT FALSE,
                returned_at DATETIME,
                notes VARCHAR(500)
            )
        """))
    conn.commit()
print("  Tables ready")

# ── STAFF USERS ──────────────────────────────────────────────────────────────

print("\nSeeding staff...")
staff_data = [
    ("morrison.s",  "Sarah",    "Morrison", "Flt Lt",   "OC",      True),
    ("clarke.d",    "David",    "Clarke",   "Fg Off",   "Adj",     False),
    ("reid.t",      "Thomas",   "Reid",     "WO",       "SNCO",    False),
    ("burns.p",     "Patricia", "Burns",    "FS",       "SNCO",    False),
    ("stewart.m",   "Michael",  "Stewart",  "CI",       "CI",      False),
]
staff_ids = {}
for username, forename, surname, rank, role, is_admin in staff_data:
    exists = db.execute(text("SELECT id FROM users WHERE username=:u"), {"u": username}).fetchone()
    if exists:
        staff_ids[username] = exists.id
        print(f"  Skipping {username} (exists)")
        continue
    r = db.execute(text("""
        INSERT INTO users (username, forename, surname, password_hash, staff_rank, role, is_admin, active, created_at)
        VALUES (:u, :f, :s, :ph, :rank, :role, :admin, 1, :ts)
    """), {
        "u": username, "f": forename, "s": surname,
        "ph": hash_password("Password1!"),
        "rank": rank, "role": role, "admin": 1 if is_admin else 0,
        "ts": now_offset(180),
    })
    staff_ids[username] = r.lastrowid
    print(f"  Added: {rank} {forename} {surname} ({role})")

db.commit()

admin_id = db.execute(text("SELECT id FROM users WHERE username='admin'")).fetchone().id
oc_id = staff_ids.get("morrison.s", admin_id)
adj_id = staff_ids.get("clarke.d", admin_id)

# ── CADETS ───────────────────────────────────────────────────────────────────

print("\nSeeding cadets...")
CADETS = [
    # Flight A
    ("2408001", "Sgt",  "Jamie",   "Henderson", "male",   "A", True,  now_offset(400)),
    ("2408002", "Cpl",  "Zoe",     "Fraser",    "female", "A", True,  now_offset(380)),
    ("2408003", "Cpl",  "Liam",    "MacKenzie", "male",   "A", True,  now_offset(360)),
    ("2408004", "Cdt",  "Amy",     "Stewart",   "female", "A", True,  now_offset(310)),
    ("2408005", "Cdt",  "Kyle",    "Robertson", "male",   "A", True,  now_offset(300)),
    ("2408006", "Cdt",  "Megan",   "Campbell",  "female", "A", True,  now_offset(290)),
    ("2408007", "Cdt",  "Connor",  "Reid",      "male",   "A", True,  now_offset(270)),
    ("2408008", "Cdt",  "Sophie",  "Gray",      "female", "A", True,  now_offset(260)),
    ("2408009", "Cdt",  "Ryan",    "Murray",    "male",   "A", True,  now_offset(245)),
    # Flight B
    ("2408010", "FS",   "Daniel",  "Morrison",  "male",   "B", True,  now_offset(450)),
    ("2408011", "Cpl",  "Rachel",  "Thomson",   "female", "B", True,  now_offset(390)),
    ("2408012", "Cdt",  "Jack",    "Wilson",    "male",   "B", True,  now_offset(330)),
    ("2408013", "Cdt",  "Chloe",   "Anderson",  "female", "B", True,  now_offset(315)),
    ("2408014", "Cdt",  "Ben",     "Taylor",    "male",   "B", True,  now_offset(295)),
    ("2408015", "Cdt",  "Hannah",  "Scott",     "female", "B", True,  now_offset(280)),
    ("2408016", "Cdt",  "Ethan",   "Brown",     "male",   "B", True,  now_offset(230)),
    ("2408017", "Cdt",  "Grace",   "Walker",    "female", "B", True,  now_offset(210)),
    ("2408018", "Cdt",  "Lewis",   "Clark",     "male",   "B", True,  now_offset(195)),
    # Flight C
    ("2408019", "CWO",  "Cameron", "Mitchell",  "male",   "C", True,  now_offset(500)),
    ("2408020", "Cpl",  "Isla",    "Young",     "female", "C", True,  now_offset(370)),
    ("2408021", "Cdt",  "Rory",    "Evans",     "male",   "C", True,  now_offset(320)),
    ("2408022", "Cdt",  "Niamh",   "Collins",   "female", "C", True,  now_offset(305)),
    ("2408023", "Cdt",  "Dylan",   "Wright",    "male",   "C", True,  now_offset(285)),
    ("2408024", "Cdt",  "Eilidh",  "Ross",      "female", "C", True,  now_offset(265)),
    ("2408025", "Cdt",  "Callum",  "Hughes",    "male",   "C", True,  now_offset(250)),
    # Recently left (inactive)
    ("2407901", "Cdt",  "James",   "Patterson", "male",   "A", False, now_offset(600)),
    ("2407902", "Cdt",  "Emma",    "McLean",    "female", "B", False, now_offset(580)),
    ("2407903", "Cdt",  "Tom",     "Gibson",    "male",   "C", False, now_offset(560)),
]

cadet_ids = {}
for svc, rank, forename, surname, gender, flight, active, joined in CADETS:
    exists = db.execute(text("SELECT id FROM cadets WHERE service_number=:s"), {"s": svc}).fetchone()
    if exists:
        cadet_ids[svc] = exists.id
        continue
    r = db.execute(text("""
        INSERT INTO cadets (service_number, rank, forename, surname, gender, flight, active, joined_at)
        VALUES (:svc, :rank, :fn, :sn, :g, :fl, :act, :ts)
    """), {"svc": svc, "rank": rank, "fn": forename, "sn": surname,
           "g": gender, "fl": flight, "act": 1 if active else 0, "ts": joined})
    cadet_ids[svc] = r.lastrowid

db.commit()
print(f"  {len(cadet_ids)} cadets ready")

# ── STOCK LEVELS ─────────────────────────────────────────────────────────────

print("\nSetting stock levels...")
# item_id → size_label → quantity
STOCK = {
    "No2 Trousers (M)": {
        "72/80/96": 3, "72/84/100": 4, "72/88/104": 2, "75/80/96": 3,
        "75/84/100": 5, "75/88/104": 4, "80/80/96": 2, "80/84/100": 3,
        "80/88/104": 2, "80/92/108": 1, "85/84/100": 1, "85/88/104": 2,
        "69/72/84": 1, "72/72/88": 2, "OUTSIZE": 0,
    },
    "Wedgewood Shirt (M)": {
        "34": 4, "35": 5, "36": 6, "37": 8, "38": 7, "39": 6,
        "40": 5, "41": 4, "42": 3, "43": 2, "44": 2, "45": 1,
        "31": 1, "32": 1, "33": 2, "46": 1, "47": 0, "48": 0, "OUTSIZE": 0,
    },
    "Wedgewood Shirt Extra Long (M)": {
        "37": 3, "38": 4, "39": 4, "40": 3, "41": 3, "42": 2,
        "43": 2, "44": 1, "45": 1, "46": 0, "47": 0, "48": 0,
    },
    "Dark Blue Shirt (M)": {
        "31": 2, "32/34": 5, "35/37": 8, "38/40": 7,
        "41/43": 4, "44/46": 3, "47/48": 1, "OUTSIZE": 0,
    },
    "Wedgewood Shirt (W)": {
        "32/88": 2, "33/88": 2, "34/88": 3, "34/92": 4, "35/92": 4,
        "35/96": 3, "36/96": 3, "36/100": 2, "37/100": 2, "37/104": 1,
        "38/104": 1, "38/108": 1, "39/108": 0, "39/112": 0,
        "40/112": 0, "41/112": 0, "OUTSIZE": 0,
    },
    "No2 Skirt (W)": {
        "67/64/92": 1, "67/68/96": 2, "67/72/100": 3, "67/76/104": 2,
        "67/80/108": 2, "71/68/96": 2, "71/72/100": 2, "71/76/104": 3,
        "71/80/108": 2, "71/84/108": 1, "75/72/100": 1, "75/76/104": 1,
        "OUTSIZE": 0,
    },
    "No2 Slacks (W)": {
        "72/64/92": 1, "72/68/96": 2, "72/72/100": 2, "72/76/104": 2,
        "72/80/108": 1, "77/68/96": 1, "77/72/100": 2, "77/76/104": 2,
        "77/80/108": 1, "82/72/100": 1, "82/76/104": 1, "OUTSIZE": 0,
    },
    "Beret": {
        "48": 0, "49": 1, "50": 2, "51": 4, "52": 5, "53": 6,
        "54": 7, "55": 6, "56": 5, "57": 4, "58": 3, "59": 2,
        "60": 1, "61": 1, "62": 0, "OUTSIZE": 0,
    },
    "Utility Jumper": {
        "74": 1, "82": 2, "88": 4, "94": 5, "100": 6, "106": 5,
        "112": 4, "118": 3, "124": 2, "130": 1, "136": 0, "OUTSIZE": 0,
    },
    "Wet Weather Jacket": {
        "160/88": 2, "170/96": 4, "170/104": 5, "170/112": 4,
        "180/96": 3, "180/104": 3, "180/112": 2, "190/120": 1, "OUTSIZE": 0,
    },
    "Coveralls": {
        "160/84": 1, "160/92": 2, "170/92": 3, "170/100": 4,
        "170/108": 3, "180/92": 2, "180/100": 3, "180/108": 2,
        "190/100": 1, "190/108": 1, "OUTSIZE": 0,
    },
    "Black Tie":    {"STANDARD": 18},
    "RAF Belt":     {"64-114cm": 22},
    "Brassard":     {"STANDARD": 30},
    "Gloves (M)":   {"7": 3, "7½": 5, "8": 7, "8½": 6, "9": 4, "9½": 2, "10": 1, "6½": 1},
    "Gloves (W)":   {"6½": 2, "7": 4, "7½": 5, "8": 4, "8½": 2, "9": 1},
    "Socks (Thin)": {"3-6": 8, "7-10": 15, "11-14": 6},
    "Socks (Thick)":{"3-6": 6, "7-10": 12, "11-14": 4},
}

for short_name, size_qtys in STOCK.items():
    item = db.execute(text("SELECT id FROM items WHERE short_name=:n"), {"n": short_name}).fetchone()
    if not item:
        print(f"  WARN: item not found: {short_name}")
        continue
    for size_label, qty in size_qtys.items():
        size = db.execute(text(
            "SELECT s.id FROM sizes s WHERE s.item_id=:i AND s.size_label=:sl"
        ), {"i": item.id, "sl": size_label}).fetchone()
        if not size:
            continue
        db.execute(text(
            "UPDATE stock SET quantity=:q WHERE item_id=:i AND size_id=:s"
        ), {"q": qty, "i": item.id, "s": size.id})

db.commit()
print("  Stock levels set")

# ── ISSUE KIT TO CADETS ───────────────────────────────────────────────────────

print("\nIssuing kit to cadets...")

def get_item_size(short_name, size_label):
    """Return (item_id, size_id) or None."""
    row = db.execute(text("""
        SELECT i.id as iid, s.id as sid
        FROM items i JOIN sizes s ON s.item_id = i.id
        WHERE i.short_name=:n AND s.size_label=:sl
    """), {"n": short_name, "sl": size_label}).fetchone()
    return (row.iid, row.sid) if row else None

def issue(cadet_id, item_id, size_id, issued_by, days_ago, qty=1, note=None):
    already = db.execute(text("""
        SELECT id FROM issued_items
        WHERE cadet_id=:c AND item_id=:i AND size_id=:s AND returned=0
    """), {"c": cadet_id, "i": item_id, "s": size_id}).fetchone()
    if already:
        return
    db.execute(text("""
        INSERT INTO issued_items (cadet_id, item_id, size_id, quantity, issued_by_id, issued_at, returned, notes)
        VALUES (:c, :i, :s, :qty, :by, :ts, 0, :note)
    """), {"c": cadet_id, "i": item_id, "s": size_id, "qty": qty,
           "by": issued_by, "ts": now_offset(days_ago), "note": note})

# Kit issue plans per cadet (service_number → kit spec)
# Each tuple: (short_name, size_label, qty, days_ago)
KIT = {
    # ── FLIGHT A ──
    "2408001": [  # Sgt Jamie Henderson (M)
        ("No2 Trousers (M)", "75/84/100", 1, 380),
        ("Wedgewood Shirt (M)", "38", 2, 380),
        ("Dark Blue Shirt (M)", "35/37", 2, 380),
        ("Beret", "54", 1, 380),
        ("Utility Jumper", "94", 1, 380),
        ("Wet Weather Jacket", "170/96", 1, 380),
        ("Black Tie", "STANDARD", 1, 380),
        ("RAF Belt", "64-114cm", 1, 380),
        ("Brassard", "STANDARD", 1, 380),
        ("Gloves (M)", "8", 1, 380),
        ("Socks (Thin)", "7-10", 2, 380),
        ("Socks (Thick)", "7-10", 2, 380),
    ],
    "2408002": [  # Cpl Zoe Fraser (F)
        ("No2 Slacks (W)", "72/68/96", 1, 360),
        ("Wedgewood Shirt (W)", "34/92", 2, 360),
        ("Dark Blue Shirt (M)", "32/34", 2, 360),
        ("Beret", "52", 1, 360),
        ("Utility Jumper", "88", 1, 360),
        ("Wet Weather Jacket", "160/88", 1, 360),
        ("Black Tie", "STANDARD", 1, 360),
        ("RAF Belt", "64-114cm", 1, 360),
        ("Brassard", "STANDARD", 1, 360),
        ("Gloves (W)", "7", 1, 360),
        ("Socks (Thin)", "3-6", 2, 360),
        ("Socks (Thick)", "3-6", 2, 360),
    ],
    "2408003": [  # Cpl Liam MacKenzie (M)
        ("No2 Trousers (M)", "72/84/100", 1, 340),
        ("Wedgewood Shirt (M)", "37", 2, 340),
        ("Dark Blue Shirt (M)", "35/37", 2, 340),
        ("Beret", "53", 1, 340),
        ("Utility Jumper", "94", 1, 340),
        ("Wet Weather Jacket", "170/96", 1, 340),
        ("Black Tie", "STANDARD", 1, 340),
        ("RAF Belt", "64-114cm", 1, 340),
        ("Brassard", "STANDARD", 1, 340),
        ("Gloves (M)", "8½", 1, 340),
        ("Socks (Thin)", "7-10", 2, 340),
        ("Socks (Thick)", "7-10", 2, 340),
    ],
    "2408004": [  # Cdt Amy Stewart (F) — partial kit (missing gloves, socks)
        ("No2 Skirt (W)", "67/72/100", 1, 290),
        ("Wedgewood Shirt (W)", "33/88", 2, 290),
        ("Beret", "51", 1, 290),
        ("Utility Jumper", "82", 1, 290),
        ("Black Tie", "STANDARD", 1, 290),
        ("RAF Belt", "64-114cm", 1, 290),
        ("Brassard", "STANDARD", 1, 290),
    ],
    "2408005": [  # Cdt Kyle Robertson (M)
        ("No2 Trousers (M)", "72/80/96", 1, 280),
        ("Wedgewood Shirt (M)", "36", 2, 280),
        ("Dark Blue Shirt (M)", "35/37", 2, 280),
        ("Beret", "55", 1, 280),
        ("Utility Jumper", "94", 1, 280),
        ("Wet Weather Jacket", "170/104", 1, 280),
        ("Black Tie", "STANDARD", 1, 280),
        ("RAF Belt", "64-114cm", 1, 280),
        ("Brassard", "STANDARD", 1, 280),
        ("Gloves (M)", "8", 1, 280),
        ("Socks (Thin)", "7-10", 2, 280),
        ("Socks (Thick)", "7-10", 2, 280),
    ],
    "2408006": [  # Cdt Megan Campbell (F) — partial kit
        ("No2 Slacks (W)", "72/72/100", 1, 270),
        ("Wedgewood Shirt (W)", "34/88", 2, 270),
        ("Beret", "52", 1, 270),
        ("Utility Jumper", "82", 1, 270),
        ("Wet Weather Jacket", "160/88", 1, 270),
        ("Black Tie", "STANDARD", 1, 270),
        ("RAF Belt", "64-114cm", 1, 270),
        ("Brassard", "STANDARD", 1, 270),
    ],
    "2408007": [  # Cdt Connor Reid (M)
        ("No2 Trousers (M)", "69/72/84", 1, 250),
        ("Wedgewood Shirt (M)", "35", 2, 250),
        ("Dark Blue Shirt (M)", "32/34", 2, 250),
        ("Beret", "51", 1, 250),
        ("Utility Jumper", "82", 1, 250),
        ("Wet Weather Jacket", "160/88", 1, 250),
        ("Black Tie", "STANDARD", 1, 250),
        ("RAF Belt", "64-114cm", 1, 250),
        ("Brassard", "STANDARD", 1, 250),
        ("Gloves (M)", "7", 1, 250),
        ("Socks (Thin)", "7-10", 2, 250),
        ("Socks (Thick)", "7-10", 2, 250),
    ],
    "2408008": [  # Cdt Sophie Gray (F) — new joiner, very partial kit
        ("Beret", "53", 1, 240),
        ("Brassard", "STANDARD", 1, 240),
        ("RAF Belt", "64-114cm", 1, 240),
    ],
    "2408009": [  # Cdt Ryan Murray (M) — new joiner, partial kit
        ("Beret", "56", 1, 230),
        ("Brassard", "STANDARD", 1, 230),
        ("RAF Belt", "64-114cm", 1, 230),
    ],
    # ── FLIGHT B ──
    "2408010": [  # FS Daniel Morrison (M)
        ("No2 Trousers (M)", "80/88/104", 1, 430),
        ("Wedgewood Shirt (M)", "40", 2, 430),
        ("Dark Blue Shirt (M)", "38/40", 2, 430),
        ("Beret", "56", 1, 430),
        ("Utility Jumper", "100", 1, 430),
        ("Wet Weather Jacket", "180/104", 1, 430),
        ("Black Tie", "STANDARD", 1, 430),
        ("RAF Belt", "64-114cm", 1, 430),
        ("Brassard", "STANDARD", 1, 430),
        ("Gloves (M)", "9", 1, 430),
        ("Socks (Thin)", "11-14", 2, 430),
        ("Socks (Thick)", "11-14", 2, 430),
    ],
    "2408011": [  # Cpl Rachel Thomson (F)
        ("No2 Skirt (W)", "71/72/100", 1, 370),
        ("Wedgewood Shirt (W)", "35/92", 2, 370),
        ("Dark Blue Shirt (M)", "32/34", 2, 370),
        ("Beret", "54", 1, 370),
        ("Utility Jumper", "88", 1, 370),
        ("Wet Weather Jacket", "170/96", 1, 370),
        ("Black Tie", "STANDARD", 1, 370),
        ("RAF Belt", "64-114cm", 1, 370),
        ("Brassard", "STANDARD", 1, 370),
        ("Gloves (W)", "7½", 1, 370),
        ("Socks (Thin)", "3-6", 2, 370),
        ("Socks (Thick)", "3-6", 2, 370),
    ],
    "2408012": [  # Cdt Jack Wilson (M)
        ("No2 Trousers (M)", "75/80/96", 1, 310),
        ("Wedgewood Shirt (M)", "37", 2, 310),
        ("Dark Blue Shirt (M)", "35/37", 2, 310),
        ("Beret", "53", 1, 310),
        ("Utility Jumper", "94", 1, 310),
        ("Wet Weather Jacket", "170/96", 1, 310),
        ("Black Tie", "STANDARD", 1, 310),
        ("RAF Belt", "64-114cm", 1, 310),
        ("Brassard", "STANDARD", 1, 310),
        ("Gloves (M)", "8", 1, 310),
        ("Socks (Thin)", "7-10", 2, 310),
        ("Socks (Thick)", "7-10", 2, 310),
    ],
    "2408013": [  # Cdt Chloe Anderson (F)
        ("No2 Slacks (W)", "72/68/96", 1, 295),
        ("Wedgewood Shirt (W)", "34/88", 2, 295),
        ("Dark Blue Shirt (M)", "32/34", 2, 295),
        ("Beret", "51", 1, 295),
        ("Utility Jumper", "82", 1, 295),
        ("Wet Weather Jacket", "160/88", 1, 295),
        ("Black Tie", "STANDARD", 1, 295),
        ("RAF Belt", "64-114cm", 1, 295),
        ("Brassard", "STANDARD", 1, 295),
        ("Gloves (W)", "6½", 1, 295),
        ("Socks (Thin)", "3-6", 2, 295),
        ("Socks (Thick)", "3-6", 2, 295),
    ],
    "2408014": [  # Cdt Ben Taylor (M)
        ("No2 Trousers (M)", "72/76/92", 1, 275),
        ("Wedgewood Shirt (M)", "36", 2, 275),
        ("Dark Blue Shirt (M)", "35/37", 2, 275),
        ("Beret", "52", 1, 275),
        ("Utility Jumper", "88", 1, 275),
        ("Black Tie", "STANDARD", 1, 275),
        ("RAF Belt", "64-114cm", 1, 275),
        ("Brassard", "STANDARD", 1, 275),
        ("Gloves (M)", "7½", 1, 275),
        ("Socks (Thin)", "7-10", 2, 275),
    ],
    "2408015": [  # Cdt Hannah Scott (F) — partial kit (new joiner)
        ("Beret", "52", 1, 260),
        ("Brassard", "STANDARD", 1, 260),
        ("RAF Belt", "64-114cm", 1, 260),
    ],
    "2408016": [  # Cdt Ethan Brown (M)
        ("No2 Trousers (M)", "75/76/92", 1, 215),
        ("Wedgewood Shirt (M)", "37", 2, 215),
        ("Dark Blue Shirt (M)", "35/37", 2, 215),
        ("Beret", "55", 1, 215),
        ("Utility Jumper", "94", 1, 215),
        ("Wet Weather Jacket", "170/104", 1, 215),
        ("Black Tie", "STANDARD", 1, 215),
        ("RAF Belt", "64-114cm", 1, 215),
        ("Brassard", "STANDARD", 1, 215),
        ("Gloves (M)", "8", 1, 215),
        ("Socks (Thin)", "7-10", 2, 215),
        ("Socks (Thick)", "7-10", 2, 215),
    ],
    "2408017": [  # Cdt Grace Walker (F)
        ("No2 Skirt (W)", "67/68/96", 1, 195),
        ("Wedgewood Shirt (W)", "33/88", 2, 195),
        ("Dark Blue Shirt (M)", "32/34", 2, 195),
        ("Beret", "50", 1, 195),
        ("Utility Jumper", "82", 1, 195),
        ("Black Tie", "STANDARD", 1, 195),
        ("RAF Belt", "64-114cm", 1, 195),
        ("Brassard", "STANDARD", 1, 195),
    ],
    "2408018": [  # Cdt Lewis Clark (M) — newest in B flight
        ("Beret", "54", 1, 180),
        ("Brassard", "STANDARD", 1, 180),
        ("RAF Belt", "64-114cm", 1, 180),
        ("Black Tie", "STANDARD", 1, 180),
    ],
    # ── FLIGHT C ──
    "2408019": [  # CWO Cameron Mitchell (M)
        ("No2 Trousers (M)", "80/84/100", 1, 480),
        ("Wedgewood Shirt (M)", "41", 2, 480),
        ("Dark Blue Shirt (M)", "41/43", 2, 480),
        ("Beret", "57", 1, 480),
        ("Utility Jumper", "106", 1, 480),
        ("Wet Weather Jacket", "180/104", 1, 480),
        ("Black Tie", "STANDARD", 1, 480),
        ("RAF Belt", "64-114cm", 1, 480),
        ("Brassard", "STANDARD", 1, 480),
        ("Gloves (M)", "9", 1, 480),
        ("Socks (Thin)", "11-14", 2, 480),
        ("Socks (Thick)", "11-14", 2, 480),
        ("Coveralls", "180/100", 1, 480),
    ],
    "2408020": [  # Cpl Isla Young (F)
        ("No2 Slacks (W)", "72/72/100", 1, 350),
        ("Wedgewood Shirt (W)", "35/96", 2, 350),
        ("Dark Blue Shirt (M)", "32/34", 2, 350),
        ("Beret", "53", 1, 350),
        ("Utility Jumper", "88", 1, 350),
        ("Wet Weather Jacket", "170/96", 1, 350),
        ("Black Tie", "STANDARD", 1, 350),
        ("RAF Belt", "64-114cm", 1, 350),
        ("Brassard", "STANDARD", 1, 350),
        ("Gloves (W)", "7", 1, 350),
        ("Socks (Thin)", "7-10", 2, 350),
        ("Socks (Thick)", "7-10", 2, 350),
    ],
    "2408021": [  # Cdt Rory Evans (M)
        ("No2 Trousers (M)", "72/88/104", 1, 300),
        ("Wedgewood Shirt (M)", "39", 2, 300),
        ("Dark Blue Shirt (M)", "38/40", 2, 300),
        ("Beret", "54", 1, 300),
        ("Utility Jumper", "100", 1, 300),
        ("Wet Weather Jacket", "170/104", 1, 300),
        ("Black Tie", "STANDARD", 1, 300),
        ("RAF Belt", "64-114cm", 1, 300),
        ("Brassard", "STANDARD", 1, 300),
        ("Gloves (M)", "8½", 1, 300),
        ("Socks (Thin)", "7-10", 2, 300),
        ("Socks (Thick)", "7-10", 2, 300),
    ],
    "2408022": [  # Cdt Niamh Collins (F)
        ("No2 Skirt (W)", "71/76/104", 1, 285),
        ("Wedgewood Shirt (W)", "36/96", 2, 285),
        ("Dark Blue Shirt (M)", "32/34", 2, 285),
        ("Beret", "52", 1, 285),
        ("Utility Jumper", "88", 1, 285),
        ("Black Tie", "STANDARD", 1, 285),
        ("RAF Belt", "64-114cm", 1, 285),
        ("Brassard", "STANDARD", 1, 285),
        ("Gloves (W)", "7", 1, 285),
        ("Socks (Thin)", "3-6", 2, 285),
    ],
    "2408023": [  # Cdt Dylan Wright (M)
        ("No2 Trousers (M)", "72/80/96", 1, 265),
        ("Wedgewood Shirt (M)", "36", 2, 265),
        ("Dark Blue Shirt (M)", "35/37", 2, 265),
        ("Beret", "53", 1, 265),
        ("Utility Jumper", "88", 1, 265),
        ("Wet Weather Jacket", "170/96", 1, 265),
        ("Black Tie", "STANDARD", 1, 265),
        ("RAF Belt", "64-114cm", 1, 265),
        ("Brassard", "STANDARD", 1, 265),
        ("Gloves (M)", "7½", 1, 265),
        ("Socks (Thin)", "7-10", 2, 265),
        ("Socks (Thick)", "7-10", 2, 265),
    ],
    "2408024": [  # Cdt Eilidh Ross (F) — partial kit
        ("Beret", "51", 1, 250),
        ("Brassard", "STANDARD", 1, 250),
        ("RAF Belt", "64-114cm", 1, 250),
        ("Black Tie", "STANDARD", 1, 250),
    ],
    "2408025": [  # Cdt Callum Hughes (M) — partial kit
        ("No2 Trousers (M)", "72/76/92", 1, 235),
        ("Wedgewood Shirt (M)", "36", 2, 235),
        ("Beret", "53", 1, 235),
        ("RAF Belt", "64-114cm", 1, 235),
        ("Brassard", "STANDARD", 1, 235),
        ("Black Tie", "STANDARD", 1, 235),
    ],
    # ── INACTIVE (left) ──
    "2407901": [  # James Patterson — has kit (will be returned)
        ("No2 Trousers (M)", "75/80/96", 1, 550),
        ("Wedgewood Shirt (M)", "38", 2, 550),
        ("Beret", "54", 1, 550),
        ("Utility Jumper", "94", 1, 550),
        ("Black Tie", "STANDARD", 1, 550),
        ("RAF Belt", "64-114cm", 1, 550),
        ("Brassard", "STANDARD", 1, 550),
    ],
    "2407902": [  # Emma McLean — all kit returned (see below)
        ("No2 Skirt (W)", "67/72/100", 1, 530),
        ("Wedgewood Shirt (W)", "34/92", 2, 530),
        ("Beret", "52", 1, 530),
        ("Utility Jumper", "82", 1, 530),
        ("Black Tie", "STANDARD", 1, 530),
        ("RAF Belt", "64-114cm", 1, 530),
        ("Brassard", "STANDARD", 1, 530),
    ],
    "2407903": [  # Tom Gibson
        ("No2 Trousers (M)", "80/84/100", 1, 510),
        ("Wedgewood Shirt (M)", "40", 2, 510),
        ("Beret", "55", 1, 510),
        ("Utility Jumper", "100", 1, 510),
        ("Black Tie", "STANDARD", 1, 510),
        ("RAF Belt", "64-114cm", 1, 510),
        ("Brassard", "STANDARD", 1, 510),
    ],
}

issued_count = 0
for svc, kit_list in KIT.items():
    cid = cadet_ids.get(svc)
    if not cid:
        continue
    for short_name, size_label, qty, days_ago in kit_list:
        ids = get_item_size(short_name, size_label)
        if ids:
            issue(cid, ids[0], ids[1], adj_id, days_ago, qty)
            issued_count += 1

db.commit()
print(f"  {issued_count} kit line issues recorded")

# ── RETURNS FOR LEAVERS ───────────────────────────────────────────────────────

print("\nProcessing returns for leavers...")

def process_return(cadet_svc, days_ago, condition="serviceable"):
    cid = cadet_ids.get(cadet_svc)
    if not cid:
        return 0
    issued = db.execute(text("""
        SELECT id FROM issued_items WHERE cadet_id=:c AND returned=0
    """), {"c": cid}).fetchall()
    count = 0
    for row in issued:
        db.execute(text(
            "UPDATE issued_items SET returned=1 WHERE id=:id"
        ), {"id": row.id})
        db.execute(text("""
            INSERT INTO returned_items (issued_item_id, returned_by_id, returned_at, condition, notes)
            VALUES (:iid, :uid, :ts, :cond, :note)
        """), {
            "iid": row.id, "uid": adj_id,
            "ts": now_offset(days_ago),
            "cond": condition,
            "note": "Kit returned on leaving squadron",
        })
        count += 1
    return count

r1 = process_return("2407902", 520, "serviceable")   # Emma — full return, all good
r2 = process_return("2407903", 500, "unserviceable") # Tom — returned but damaged
db.commit()
print(f"  {r1 + r2} items returned from leavers")

# ── BADGES ────────────────────────────────────────────────────────────────────

print("\nSeeding badges and issuing to cadets...")

existing_badges = db.execute(text("SELECT COUNT(*) as c FROM badge_items")).fetchone().c
if existing_badges == 0:
    badges = [
        ("Corporal", "Rank Slides", "Cadet", 1),
        ("Sergeant", "Rank Slides", "Cadet", 1),
        ("Flight Sergeant", "Rank Slides", "Cadet", 1),
        ("Cadet Warrant Officer", "Rank Slides", "Cadet", 1),
        ("Squadron Identifier (1701)", "Misc", None, 1),
        ("Air Training Corps", "Misc", None, 1),
        ("Beret Badge", "Misc", None, 1),
        ("RAFAC TRF", "Misc", None, 1),
        ("1st Class", "Classification", None, 1),
        ("Leading", "Classification", None, 1),
        ("Senior", "Classification", None, 1),
        ("Master", "Classification", None, 1),
        ("Leadership – Blue", "PTS", "Leadership", 1),
        ("Leadership – Bronze", "PTS", "Leadership", 0),
        ("Leadership – Silver", "PTS", "Leadership", 0),
        ("Shooting – Blue", "PTS", "Shooting", 1),
        ("Shooting – Bronze", "PTS", "Shooting", 0),
        ("First Aid – Blue", "PTS", "First Aid", 1),
        ("First Aid – Bronze", "PTS", "First Aid", 0),
        ("Duke of Edinburgh's Award – Bronze", "PTS", "DofE", 0),
        ("Duke of Edinburgh's Award – Silver", "PTS", "DofE", 0),
        ("Duke of Edinburgh's Award – Gold", "PTS", "DofE", 0),
    ]
    for name, cat, subcat, routine in badges:
        r = db.execute(text("""
            INSERT INTO badge_items (name, category, subcategory, routine_stock)
            VALUES (:n, :c, :s, :r)
        """), {"n": name, "c": cat, "s": subcat, "r": routine})
        if routine:
            db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, 0)"), {"id": r.lastrowid})
    db.commit()
    print(f"  Seeded {len(badges)} badge types")
else:
    print(f"  Badges already exist ({existing_badges}), skipping type seed")

# Set badge stock quantities
badge_stock_levels = {
    "Corporal": 8,
    "Sergeant": 5,
    "Flight Sergeant": 3,
    "Cadet Warrant Officer": 2,
    "Squadron Identifier (1701)": 20,
    "Air Training Corps": 20,
    "Beret Badge": 15,
    "RAFAC TRF": 18,
    "1st Class": 10,
    "Leading": 8,
    "Senior": 5,
    "Master": 3,
    "Leadership – Blue": 4,
    "Shooting – Blue": 6,
    "First Aid – Blue": 5,
}
for name, qty in badge_stock_levels.items():
    badge = db.execute(text("SELECT id FROM badge_items WHERE name=:n"), {"n": name}).fetchone()
    if badge:
        stock = db.execute(text("SELECT id FROM badge_stock WHERE badge_item_id=:id"), {"id": badge.id}).fetchone()
        if stock:
            db.execute(text("UPDATE badge_stock SET quantity=:q WHERE badge_item_id=:id"), {"q": qty, "id": badge.id})
        else:
            db.execute(text("INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, :q)"), {"id": badge.id, "q": qty})
db.commit()

def issue_badge(badge_name, cadet_svc, days_ago, notes=None):
    badge = db.execute(text("SELECT id FROM badge_items WHERE name=:n"), {"n": badge_name}).fetchone()
    cid = cadet_ids.get(cadet_svc)
    if not badge or not cid:
        return
    already = db.execute(text("""
        SELECT id FROM badge_issued WHERE badge_item_id=:b AND cadet_id=:c AND returned=0
    """), {"b": badge.id, "c": cid}).fetchone()
    if already:
        return
    db.execute(text("""
        INSERT INTO badge_issued (badge_item_id, cadet_id, issued_by_id, issued_at, notes)
        VALUES (:b, :c, :uid, :ts, :notes)
    """), {"b": badge.id, "c": cid, "uid": admin_id,
           "ts": now_offset(days_ago), "notes": notes})

# Rank slides for promoted cadets
issue_badge("Sergeant",            "2408001", 200)
issue_badge("Flight Sergeant",     "2408010", 150)
issue_badge("Cadet Warrant Officer","2408019", 90)
issue_badge("Corporal",            "2408002", 300)
issue_badge("Corporal",            "2408003", 310)
issue_badge("Corporal",            "2408011", 280)
issue_badge("Corporal",            "2408020", 260)

# Misc badges (everyone gets squadron ID, ATC badge, beret badge)
for svc in ["2408001","2408002","2408003","2408010","2408011","2408012",
            "2408019","2408020","2408021","2408022","2408023"]:
    issue_badge("Squadron Identifier (1701)", svc, 350, "Issued at enrolment")
    issue_badge("Air Training Corps",          svc, 350, "Issued at enrolment")
    issue_badge("Beret Badge",                 svc, 350, "Issued at enrolment")
    issue_badge("RAFAC TRF",                   svc, 350, "Issued at enrolment")

# Classification badges
issue_badge("1st Class",  "2408019", 250)
issue_badge("1st Class",  "2408010", 270)
issue_badge("1st Class",  "2408001", 260)
issue_badge("Leading",    "2408003", 180)
issue_badge("Leading",    "2408002", 190)
issue_badge("Senior",     "2408011", 120)

# PTS badges
issue_badge("Leadership – Blue",  "2408019", 180, "Passed JNCO course")
issue_badge("Leadership – Bronze","2408019", 90,  "Passed SNCO module")
issue_badge("Shooting – Blue",    "2408001", 200)
issue_badge("Shooting – Blue",    "2408010", 190)
issue_badge("Shooting – Blue",    "2408003", 160)
issue_badge("First Aid – Blue",   "2408002", 170)
issue_badge("First Aid – Blue",   "2408011", 140)
issue_badge("First Aid – Blue",   "2408020", 130)
issue_badge("Duke of Edinburgh's Award – Bronze", "2408019", 100, "Completed Mar 2026")
issue_badge("Duke of Edinburgh's Award – Bronze", "2408010", 95,  "Completed Apr 2026")

db.commit()
print("  Badges issued")

# ── FEEDBACK ─────────────────────────────────────────────────────────────────

print("\nSeeding feedback...")

feedback_entries = [
    (oc_id,  "Shirt stock running low in sizes 37-38",
     "We're regularly running out of Wedgewood Shirts in sizes 37 and 38. Could we look at ordering more before the autumn intake?",
     "Stock", "open", None, None, now_offset(45)),
    (adj_id, "Kit issue process improvement",
     "Suggest we do group kit fittings at the start of each training term rather than one-at-a-time. Would save a lot of parade night time.",
     "Process", "replied",
     "Great idea David — let's trial this in September. I'll put it on the agenda for the next staff meeting.",
     admin_id, now_offset(60)),
    (staff_ids.get("reid.t", admin_id), "Coveralls condition",
     "Several of the coveralls in store are looking quite worn. Think we need to mark at least 3 as unserviceable and request replacements.",
     "Stock", "open", None, None, now_offset(20)),
    (staff_ids.get("burns.p", admin_id), "Leavers kit collection",
     "Can we set a standard process for collecting kit when a cadet leaves? Had two this term where kit wasn't collected promptly.",
     "Process", "replied",
     "Agreed — I'll add a leavers checklist to the system. Kit return should be done on the final parade night.",
     admin_id, now_offset(90)),
    (adj_id, "Badge tracker — DofE records",
     "Would it be possible to add a notes field to the badge issue screen? Useful for recording DofE expedition dates.",
     "Feature", "closed", None, None, now_offset(120)),
]

for sub_id, subject, message, category, status, reply, rep_id, created in feedback_entries:
    exists = db.execute(text("SELECT id FROM feedback WHERE subject=:s"), {"s": subject}).fetchone()
    if exists:
        continue
    r = db.execute(text("""
        INSERT INTO feedback (submitted_by_id, subject, message, category, status, admin_reply, replied_by_id, replied_at, created_at)
        VALUES (:uid, :sub, :msg, :cat, :st, :rep, :repid, :repat, :cat2)
    """), {
        "uid": sub_id, "sub": subject, "msg": message,
        "cat": category, "st": status,
        "rep": reply, "repid": rep_id,
        "repat": now_offset(5) if reply else None,
        "cat2": created,
    })

db.commit()
print(f"  {len(feedback_entries)} feedback entries added")

# ── AUDIT LOG ─────────────────────────────────────────────────────────────────

print("\nAdding audit log entries...")
audit_entries = [
    (admin_id,  "USER_CREATE",   None, None, "Created staff account: morrison.s",           now_offset(180)),
    (admin_id,  "USER_CREATE",   None, None, "Created staff account: clarke.d",             now_offset(180)),
    (admin_id,  "USER_CREATE",   None, None, "Created staff account: reid.t",               now_offset(180)),
    (admin_id,  "CADET_CREATE",  cadet_ids.get("2408019"), None, "Enrolled cadet: 2408019 Mitchell", now_offset(500)),
    (admin_id,  "CADET_CREATE",  cadet_ids.get("2408010"), None, "Enrolled cadet: 2408010 Morrison",  now_offset(450)),
    (adj_id,    "KIT_ISSUE",     cadet_ids.get("2408019"), None, "Full kit issued to 2408019 Mitchell", now_offset(480)),
    (adj_id,    "CADET_PROMOTE", cadet_ids.get("2408019"), None, "Rank updated: Cdt → CWO",            now_offset(150)),
    (adj_id,    "CADET_PROMOTE", cadet_ids.get("2408001"), None, "Rank updated: Cpl → Sgt",            now_offset(200)),
    (adj_id,    "KIT_RETURN",    cadet_ids.get("2407902"), None, "Full kit return: 2407902 McLean (leaving)", now_offset(520)),
    (admin_id,  "STOCK_ADJUST",  None, None, "Stock count update after annual audit",        now_offset(30)),
]

for uid, action, cadet_id, item_id, details, ts in audit_entries:
    db.execute(text("""
        INSERT INTO audit_log (user_id, action, cadet_id, item_id, details, timestamp)
        VALUES (:uid, :act, :cid, :iid, :det, :ts)
    """), {"uid": uid, "act": action, "cid": cadet_id, "iid": item_id, "det": details, "ts": ts})

db.commit()
print(f"  {len(audit_entries)} audit entries added")

# ── SUMMARY ───────────────────────────────────────────────────────────────────

total_cadets = db.execute(text("SELECT COUNT(*) as c FROM cadets WHERE active=1")).fetchone().c
total_issued = db.execute(text("SELECT COUNT(*) as c FROM issued_items WHERE returned=0")).fetchone().c
total_badges = db.execute(text("SELECT COUNT(*) as c FROM badge_issued")).fetchone().c

print(f"""
╔══════════════════════════════════════╗
║       DEMO DATA SEED COMPLETE        ║
╠══════════════════════════════════════╣
║  Active cadets:    {total_cadets:<17} ║
║  Kit lines issued: {total_issued:<17} ║
║  Badges issued:    {total_badges:<17} ║
╠══════════════════════════════════════╣
║  Flights: A (9), B (9), C (7)        ║
║  3 inactive cadets (leavers)         ║
║  5 staff + admin account             ║
║  Feedback: 5 entries (open/replied)  ║
╚══════════════════════════════════════╝
Login: click any staff card on login screen
""")

db.close()
