// The only code that reads or writes the sessions table.
import { randomBytes } from 'node:crypto';
import { db } from '../db.js';

const DAYS = 30;

export const SessionRepository = {
  create(userId) {
    const id = randomBytes(32).toString('hex');
    db.prepare(`INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', '+${DAYS} days'))`).run(id, userId);
    return this.findById(id);
  },
  findById(id) {
    return db.prepare(`SELECT *, expires_at <= datetime('now') AS expired FROM sessions WHERE id = ?`).get(id);
  },
  delete(id) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
  },
};
export const SESSION_DAYS = DAYS;
