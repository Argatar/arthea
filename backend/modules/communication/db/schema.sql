-- ===================================
-- ARTHEA - COMMUNICATION MODULE SCHEMA
-- ===================================
-- SQLite Database Schema
-- Plik: data/arthea.db (auto-tworzone)

-- ===================================
-- ROUNDS (Rundy poprawek)
-- ===================================
CREATE TABLE IF NOT EXISTS rounds (
  id TEXT PRIMARY KEY,
  shot_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'frozen', 'closed')),
  created_at INTEGER NOT NULL,
  frozen_at INTEGER,
  closed_at INTEGER,
  
  UNIQUE(shot_id, round_number)
);

CREATE INDEX IF NOT EXISTS idx_rounds_shot ON rounds(shot_id);
CREATE INDEX IF NOT EXISTS idx_rounds_status ON rounds(status);

-- ===================================
-- COMMENTS (Komentarze klienta)
-- ===================================
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  round_id TEXT NOT NULL,
  shot_id TEXT NOT NULL,
  version_id TEXT,
  
  -- Autor (klient = guest bez konta)
  author_type TEXT NOT NULL CHECK(author_type IN ('client', 'architect', 'team')),
  author_id TEXT,
  author_name TEXT,
  author_email TEXT,
  
  -- Treść
  content TEXT NOT NULL,
  
  -- Pin na obrazie (opcjonalnie)
  position_x REAL,
  position_y REAL,
  
  -- Status workflow
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'approved', 'rejected')),
  
  -- Ukrywanie przed zespołem (architekt)
  is_hidden_from_team INTEGER DEFAULT 0,
  hidden_by TEXT,
  hidden_at INTEGER,
  
  -- Wysłanie do zespołu
  sent_to_team INTEGER DEFAULT 0,
  sent_to_team_at INTEGER,
  
  -- Timestamps
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (round_id) REFERENCES rounds(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_shot ON comments(shot_id);
CREATE INDEX IF NOT EXISTS idx_comments_round ON comments(round_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_author_type ON comments(author_type);
CREATE INDEX IF NOT EXISTS idx_comments_sent_to_team ON comments(sent_to_team);

-- ===================================
-- CHAT MESSAGES (Czat klient-architekt + biuro)
-- ===================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  
  -- Typ rozmowy
  conversation_type TEXT NOT NULL CHECK(conversation_type IN ('client_architect', 'office')),
  
  -- Powiązanie z ujęciem (opcjonalnie, dla biura)
  shot_id TEXT,
  
  -- Autor
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT CHECK(author_role IN ('client', 'architect', 'team')),
  
  -- Treść
  content TEXT NOT NULL,
  
  -- Mentions (@user)
  mentions TEXT,
  
  -- Pin na wizualizacji (tylko office chat)
  is_pin INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_type ON chat_messages(conversation_type);
CREATE INDEX IF NOT EXISTS idx_chat_shot ON chat_messages(shot_id);
CREATE INDEX IF NOT EXISTS idx_chat_author ON chat_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_is_pin ON chat_messages(is_pin);

-- ===================================
-- NOTIFICATIONS (Long polling queue)
-- ===================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('comment', 'chat', 'approval', 'round_frozen')),
  target_id TEXT,
  content TEXT,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);