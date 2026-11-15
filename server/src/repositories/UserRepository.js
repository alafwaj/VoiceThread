// The only code that reads or writes the users table.
import { db } from '../db.js';

const PUBLIC = 'id, username, display_name, photo, bio, role, created_at';

export const UserRepository = {
  findById(id) {
    return db.prepare(`SELECT ${PUBLIC} FROM users WHERE id = ?`).get(id);
  },
  // Includes the private fields; only AuthService uses it, to check a password.
  findByUsernameOrEmail(value) {
    return db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(value, value);
  },
  exists(username, email) {
    return db.prepare('SELECT username, email FROM users WHERE username = ? OR email = ?').all(username, email);
  },
  create({ username, email, passwordHash, displayName }) {
    const r = db
      .prepare('INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)')
      .run(username, email, passwordHash, displayName);
    return this.findById(Number(r.lastInsertRowid));
  },
  save(user) {
    db.prepare('UPDATE users SET display_name = ?, photo = ?, bio = ? WHERE id = ?').run(
      user.display_name, user.photo ?? null, user.bio ?? '', user.id,
    );
    return this.findById(user.id);
  },
  setRole(username, role) {
    return db.prepare('UPDATE users SET role = ? WHERE username = ?').run(role, username).changes;
  },
};
