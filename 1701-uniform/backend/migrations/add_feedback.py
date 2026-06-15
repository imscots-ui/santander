import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (submitted_by_id) REFERENCES users(id),
                FOREIGN KEY (replied_by_id) REFERENCES users(id)
            )
        """))
        print("Created feedback table")
    except Exception as e:
        print(f"feedback: {e}")
    conn.commit()
print("Done")
