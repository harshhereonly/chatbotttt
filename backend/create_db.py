#!/usr/bin/env python3
"""
Create the SQLite database and the `leads` table.
Run this once (or anytime) to ensure `leads.db` exists.
"""
from pathlib import Path
import sqlite3

BASE = Path(__file__).resolve().parent
DB_PATH = BASE / 'leads.db'

CREATE_SQL = '''
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    regarding TEXT NOT NULL,
    created_at TEXT NOT NULL
);
'''


def main():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(CREATE_SQL)
    conn.commit()
    conn.close()
    print(f"Database created/verified at: {DB_PATH}")


if __name__ == '__main__':
    main()
