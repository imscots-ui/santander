import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE cadets ADD COLUMN notes TEXT NULL"))
        print("Added notes column to cadets")
    except Exception as e:
        print(f"cadets.notes: {e}")
    conn.commit()
print("Done")
