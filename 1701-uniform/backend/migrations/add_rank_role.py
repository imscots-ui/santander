import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN staff_rank VARCHAR(20) NULL"))
        print("Added staff_rank column")
    except Exception as e:
        print(f"staff_rank: {e}")
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) NULL"))
        print("Added role column")
    except Exception as e:
        print(f"role: {e}")
    conn.commit()
print("Done")
