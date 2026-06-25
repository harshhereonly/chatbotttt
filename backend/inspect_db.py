#!/usr/bin/env python3
"""
Quick inspector to list rows in `leads` table.
"""
from pathlib import Path
import sqlite3

BASE = Path(__file__).resolve().parent
DB_PATH = BASE / 'leads.db'

if not DB_PATH.exists():
    print(f"Database not found at {DB_PATH}. Create it by running: python create_db.py")
    raise SystemExit(1)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('SELECT id, name, phone, email, regarding, created_at FROM leads ORDER BY created_at DESC')
rows = cur.fetchall()
if not rows:
    print('No leads found in the database.')
else:
    for r in rows:
        print(r)
conn.close()
