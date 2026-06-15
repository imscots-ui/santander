"""Creates badge tables and seeds correct badge types for 1701 Squadron."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Create tables
    for stmt, label in [
        ("""CREATE TABLE IF NOT EXISTS badge_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                subcategory VARCHAR(100),
                description VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE,
                routine_stock BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )""", "badge_items"),
        ("""CREATE TABLE IF NOT EXISTS badge_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_item_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                FOREIGN KEY (badge_item_id) REFERENCES badge_items(id)
            )""", "badge_stock"),
        ("""CREATE TABLE IF NOT EXISTS badge_issued (
                id INT AUTO_INCREMENT PRIMARY KEY,
                badge_item_id INT NOT NULL,
                cadet_id INT NOT NULL,
                issued_by_id INT NOT NULL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                returned BOOLEAN DEFAULT FALSE,
                returned_at DATETIME,
                notes VARCHAR(500),
                FOREIGN KEY (badge_item_id) REFERENCES badge_items(id),
                FOREIGN KEY (cadet_id) REFERENCES cadets(id),
                FOREIGN KEY (issued_by_id) REFERENCES users(id)
            )""", "badge_issued"),
    ]:
        try:
            conn.execute(text(stmt))
            print(f"Created {label}")
        except Exception as e:
            print(f"{label}: {e}")

    # Clear old seed data if rerunning
    try:
        conn.execute(text("DELETE FROM badge_stock WHERE badge_item_id IN (SELECT id FROM badge_items)"))
        conn.execute(text("DELETE FROM badge_items"))
        print("Cleared old badge data")
    except Exception as e:
        print(f"Clear: {e}")

    # Seed badges
    badges = [
        # Rank Slides (Cadet) — routine stock
        ("Corporal", "Rank Slides", "Cadet", True),
        ("Sergeant", "Rank Slides", "Cadet", True),
        ("Flight Sergeant", "Rank Slides", "Cadet", True),
        ("Cadet Warrant Officer", "Rank Slides", "Cadet", True),
        # Rank Slides (Staff Cadet) — routine stock
        ("Corporal – Staff Cadet", "Rank Slides", "Staff Cadet", True),
        ("Sergeant – Staff Cadet", "Rank Slides", "Staff Cadet", True),
        ("Flight Sergeant – Staff Cadet", "Rank Slides", "Staff Cadet", True),
        ("Cadet Warrant Officer – Staff Cadet", "Rank Slides", "Staff Cadet", True),
        # Misc — routine stock
        ("Squadron Identifier (1701)", "Misc", None, True),
        ("Air Training Corps", "Misc", None, True),
        ("Beret Badge", "Misc", None, True),
        ("RAFAC TRF", "Misc", None, True),
        ("MOI Lanyard", "Misc", None, True),
        # Classification — routine stock
        ("1st Class", "Classification", None, True),
        ("Leading", "Classification", None, True),
        ("Senior", "Classification", None, True),
        ("Master", "Classification", None, True),
        # PTS — Blue only is routine; Bronze/Silver/Gold are NOT routine
        ("Leadership – Blue", "PTS", "Leadership", True),
        ("Leadership – Bronze", "PTS", "Leadership", False),
        ("Leadership – Silver", "PTS", "Leadership", False),
        ("Leadership – Gold", "PTS", "Leadership", False),
        ("Music – Blue", "PTS", "Music", True),
        ("Music – Bronze", "PTS", "Music", False),
        ("Music – Silver", "PTS", "Music", False),
        ("Music – Gold", "PTS", "Music", False),
        ("Cyber & Communications – Blue", "PTS", "Cyber & Communications", True),
        ("Cyber & Communications – Bronze", "PTS", "Cyber & Communications", False),
        ("Cyber & Communications – Silver", "PTS", "Cyber & Communications", False),
        ("Cyber & Communications – Gold", "PTS", "Cyber & Communications", False),
        ("Road Marching – Blue", "PTS", "Road Marching", True),
        ("Road Marching – Bronze", "PTS", "Road Marching", False),
        ("Road Marching – Silver", "PTS", "Road Marching", False),
        ("Road Marching – Gold", "PTS", "Road Marching", False),
        ("First Aid – Blue", "PTS", "First Aid", True),
        ("First Aid – Bronze", "PTS", "First Aid", False),
        ("First Aid – Silver", "PTS", "First Aid", False),
        ("First Aid – Gold", "PTS", "First Aid", False),
        ("Space – Blue", "PTS", "Space", True),
        ("Space – Bronze", "PTS", "Space", False),
        ("Space – Silver", "PTS", "Space", False),
        ("Space – Gold", "PTS", "Space", False),
        ("Duke of Edinburgh's Award – Blue", "PTS", "Duke of Edinburgh's Award", True),
        ("Duke of Edinburgh's Award – Bronze", "PTS", "Duke of Edinburgh's Award", False),
        ("Duke of Edinburgh's Award – Silver", "PTS", "Duke of Edinburgh's Award", False),
        ("Duke of Edinburgh's Award – Gold", "PTS", "Duke of Edinburgh's Award", False),
        ("Shooting – Blue", "PTS", "Shooting", True),
        ("Shooting – Bronze", "PTS", "Shooting", False),
        ("Shooting – Silver", "PTS", "Shooting", False),
        ("Shooting – Gold", "PTS", "Shooting", False),
    ]

    for name, category, subcategory, routine in badges:
        result = conn.execute(text(
            "INSERT INTO badge_items (name, category, subcategory, routine_stock) VALUES (:n, :c, :s, :r)"
        ), {"n": name, "c": category, "s": subcategory, "r": routine})
        badge_id = result.lastrowid
        # Only add stock row for routine items
        if routine:
            conn.execute(text(
                "INSERT INTO badge_stock (badge_item_id, quantity) VALUES (:id, 0)"
            ), {"id": badge_id})

    print(f"Seeded {len(badges)} badges")
    conn.commit()
print("Done")
