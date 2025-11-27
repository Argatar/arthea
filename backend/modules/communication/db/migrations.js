/**
 * ===================================
 * ARTHEA - DATABASE MIGRATIONS
 * ===================================
 * PLIK: modules/communication/db/migrations.js
 * 
 * CO ROBI:
 * - Tworzy tabele w bazie danych (schema.sql)
 * - Uruchamia się automatycznie przy `npm run db:migrate`
 * 
 * UŻYCIE:
 * npm run db:migrate (stwórz tabele)
 * npm run db:reset (usuń bazę i stwórz od nowa)
 * 
 * EDYTUJ jeśli dodajesz nowe tabele do modułu komunikacji
 */

import db from '../../../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Wczytaj schema.sql
const schemaPath = join(__dirname, 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

console.log('[MIGRATIONS] Running database migrations...');

try {
  // Wykonaj wszystkie CREATE TABLE statements
  db.exec(schema);
  
  console.log('[MIGRATIONS] ✅ Success! Tables created:');
  console.log('  - rounds');
  console.log('  - comments');
  console.log('  - chat_messages');
  console.log('  - notifications');
  
  // Sprawdź czy tabele istnieją
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `).all();
  
  console.log('\n[MIGRATIONS] All tables in database:');
  tables.forEach(t => console.log(`  - ${t.name}`));
  
  process.exit(0);
  
} catch (error) {
  console.error('[MIGRATIONS] ❌ Error:', error.message);
  process.exit(1);
}