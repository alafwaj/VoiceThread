// Opens the SQLite database and creates the tables if they are missing.
// The tables follow design.md sections 3 and 8 and the data classes in
// docs/uml/class.md. Node's built-in SQLite is used, so nothing has to be
// compiled on install.

import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = join(here, '..');
const DB_FILE = process.env.VT_DB_FILE || join(SERVER_ROOT, 'data', 'voicethread.db');

mkdirSync(dirname(DB_FILE), { recursive: true });

export const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  photo TEXT,
  bio TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL REFERENCES users(id),
  parent_post_id INTEGER REFERENCES posts(id),
  root_post_id INTEGER REFERENCES posts(id),
  title TEXT,
  description TEXT,
  audio_file TEXT,
  audio_type TEXT,
  duration_seconds INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_deleted INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS posts_root ON posts(root_post_id);
CREATE INDEX IF NOT EXISTS posts_author ON posts(author_id);

CREATE TABLE IF NOT EXISTS post_topics (
  post_id INTEGER NOT NULL REFERENCES posts(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  PRIMARY KEY (post_id, topic_id)
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL REFERENCES users(id),
  followed_user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, followed_user_id),
  CHECK (follower_id <> followed_user_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id INTEGER NOT NULL REFERENCES users(id),
  post_id INTEGER NOT NULL REFERENCES posts(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  reporter_id INTEGER NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  resolved_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS likes (
  user_id INTEGER NOT NULL REFERENCES users(id),
  post_id INTEGER NOT NULL REFERENCES posts(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id)
);
`);

// Databases made before likes and listens existed get the new column here,
// so nobody has to delete their data.
const postColumns = db.prepare('PRAGMA table_info(posts)').all().map((c) => c.name);
if (!postColumns.includes('listen_count')) db.exec('ALTER TABLE posts ADD COLUMN listen_count INTEGER NOT NULL DEFAULT 0');

// The fixed topic list (FR-19). Users pick from it and cannot add new ones.
const TOPICS = ['Technology', 'Philosophy', 'Storytelling', 'Science', 'Music', 'Sports', 'Education', 'Culture', 'Everyday life'];
const insertTopic = db.prepare('INSERT OR IGNORE INTO topics (name) VALUES (?)');
for (const name of TOPICS) insertTopic.run(name);

// Runs fn inside one transaction, so a failure leaves nothing half-saved (NFR-06).
export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
