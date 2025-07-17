import { Database } from "bun:sqlite"

const db = new Database("data.sqlite")

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS debts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    amount REAL,
    interestRate REAL,
    minPayment REAL,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    debts TEXT,
    monthly_budget REAL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

export default db
