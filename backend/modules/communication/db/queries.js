/**
 * ===================================
 * ARTHEA - DATABASE QUERIES
 * ===================================
 * PLIK: modules/communication/db/queries.js
 * 
 * CO ROBI:
 * - Gotowe funkcje SQL dla modułu komunikacji
 * - Raw SQL (bez ORM) dla wydajności
 * 
 * EDYTUJ jeśli chcesz zmienić zapytania SQL
 * (ale uwaga: testuj dokładnie!)
 */

import db from '../../../config/database.js';

// ===================================
// COMMENTS
// ===================================

export const commentQueries = {
  
  // Dodaj komentarz (draft lokalny)
  create: db.prepare(`
    INSERT INTO comments (
      id, round_id, shot_id, version_id,
      author_type, author_id, author_name, author_email,
      content, position_x, position_y,
      status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      'draft', ?, ?
    )
  `),
  
  // Pobierz komentarze dla ujęcia
  getByShotId: db.prepare(`
    SELECT * FROM comments
    WHERE shot_id = ?
    ORDER BY created_at DESC
  `),
  
  // Pobierz komentarze dla rundy
  getByRoundId: db.prepare(`
    SELECT * FROM comments
    WHERE round_id = ?
    ORDER BY created_at DESC
  `),
  
  // Pobierz drafty klienta (niewysłane)
  getDraftsByShotId: db.prepare(`
    SELECT * FROM comments
    WHERE shot_id = ? AND status = 'draft' AND author_type = 'client'
    ORDER BY created_at ASC
  `),
  
  // Zmień status komentarzy na "sent"
  markAsSent: db.prepare(`
    UPDATE comments
    SET status = 'sent', updated_at = ?
    WHERE id = ?
  `),
  
  // Ukryj komentarz przed zespołem (architekt)
  hide: db.prepare(`
    UPDATE comments
    SET is_hidden_from_team = 1, hidden_by = ?, hidden_at = ?, updated_at = ?
    WHERE id = ?
  `),
  
  // Odkryj komentarz (pokaż zespołowi)
  unhide: db.prepare(`
    UPDATE comments
    SET is_hidden_from_team = 0, hidden_by = NULL, hidden_at = NULL, updated_at = ?
    WHERE id = ?
  `),
  
  // Wyślij komentarze do zespołu
  sendToTeam: db.prepare(`
    UPDATE comments
    SET sent_to_team = 1, sent_to_team_at = ?, updated_at = ?
    WHERE id = ?
  `),
  
  // Pobierz komentarze do wysłania do zespołu (architekt)
  getPendingForTeam: db.prepare(`
    SELECT * FROM comments
    WHERE shot_id = ? 
      AND status = 'sent' 
      AND sent_to_team = 0
      AND is_hidden_from_team = 0
    ORDER BY created_at ASC
  `),
  
  // Pobierz komentarze widoczne dla zespołu
  getVisibleForTeam: db.prepare(`
    SELECT * FROM comments
    WHERE shot_id = ? 
      AND sent_to_team = 1
      AND is_hidden_from_team = 0
    ORDER BY created_at DESC
  `)
};

// ===================================
// CHAT MESSAGES
// ===================================

export const chatQueries = {
  
  // Dodaj wiadomość czatu
  create: db.prepare(`
    INSERT INTO chat_messages (
      id, conversation_type, shot_id,
      author_id, author_name, author_role,
      content, mentions, is_pin, created_at
    ) VALUES (
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?
    )
  `),
  
  // Pobierz historię czatu (client-architect)
  getClientArchitect: db.prepare(`
    SELECT * FROM chat_messages
    WHERE conversation_type = 'client_architect'
    ORDER BY created_at ASC
    LIMIT ? OFFSET ?
  `),
  
  // Pobierz historię czatu biura
  getOffice: db.prepare(`
    SELECT * FROM chat_messages
    WHERE conversation_type = 'office'
    ORDER BY created_at ASC
    LIMIT ? OFFSET ?
  `),
  
  // Pobierz piny dla ujęcia (office chat)
  getPinsByShotId: db.prepare(`
    SELECT * FROM chat_messages
    WHERE conversation_type = 'office'
      AND shot_id = ?
      AND is_pin = 1
    ORDER BY created_at DESC
  `)
};

// ===================================
// ROUNDS
// ===================================

export const roundQueries = {
  
  // Utwórz rundę
  create: db.prepare(`
    INSERT INTO rounds (
      id, shot_id, round_number, status, created_at
    ) VALUES (
      ?, ?, ?, 'open', ?
    )
  `),
  
  // Pobierz rundę po ID
  getById: db.prepare(`
    SELECT * FROM rounds WHERE id = ?
  `),
  
  // Pobierz aktywną rundę dla ujęcia
  getActiveByShotId: db.prepare(`
    SELECT * FROM rounds
    WHERE shot_id = ? AND status != 'closed'
    ORDER BY round_number DESC
    LIMIT 1
  `),
  
  // Zamroź rundę
  freeze: db.prepare(`
    UPDATE rounds
    SET status = 'frozen', frozen_at = ?
    WHERE id = ?
  `),
  
  // Zamknij rundę
  close: db.prepare(`
    UPDATE rounds
    SET status = 'closed', closed_at = ?
    WHERE id = ?
  `)
};

// ===================================
// NOTIFICATIONS
// ===================================

export const notificationQueries = {
  
  // Dodaj powiadomienie
  create: db.prepare(`
    INSERT INTO notifications (
      id, user_id, type, target_id, content, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?
    )
  `),
  
  // Pobierz nowe powiadomienia (long polling)
  getNewSince: db.prepare(`
    SELECT * FROM notifications
    WHERE user_id = ? AND created_at > ?
    ORDER BY created_at DESC
    LIMIT 10
  `),
  
  // Oznacz jako przeczytane
  markAsRead: db.prepare(`
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
  `)
};