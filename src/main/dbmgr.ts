import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

const dbPath = app.isPackaged
  ? path.join(app.getPath('userData'), 'app.db')
  : path.join(__dirname, '../../app.db')

const db = new Database(dbPath)

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image BLOB
    );
  `)
}

export function addItem(name: string, image: Buffer): void {
  const stmt = db.prepare('INSERT INTO items (name, image) VALUES (?, ?)')
  stmt.run(name, image)
}

export function getItems(): void {
  const stmt = db.prepare('SELECT * FROM items')
  return stmt.all()
}
