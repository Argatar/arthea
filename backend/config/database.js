/**
 * ===================================
 * ARTHEA - DATABASE CONNECTION
 * ===================================
 * PLIK: config/database.js
 * 
 * CO ROBI:
 * - Tworzy połączenie do SQLite (plik: data/arthea.db)
 * - Włącza WAL mode (Write-Ahead Logging) dla wydajności
 * - Export singleton (jedno połączenie dla całej apki)
 * 
 * UŻYCIE:
 * import db from './config/database.js';
 * const users = db.prepare('SELECT * FROM users').all();
 * 
 * NIE EDYTUJ tego pliku chyba że zmieniasz bazę danych
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Polyfill __dirname dla ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ścieżka do bazy danych
const DB_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DB_DIR, 'arthea.db');

// Utwórz folder /data jeśli nie istnieje
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
  console.log('[DB] Created /data directory');
}

// Połączenie SQLite
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Włącz WAL mode (Write-Ahead Logging)
// Korzyści: lepsze konkurencyjne zapisy, szybsze odczyty
db.pragma('journal_mode = WAL');

// Foreign keys ON (wymuszaj integralność)
db.pragma('foreign_keys = ON');

console.log(`[DB] Connected to SQLite: ${DB_PATH}`);
console.log(`[DB] WAL mode: ${db.pragma('journal_mode', { simple: true })}`);

export default db;