// The only code that reads or writes the likes table.
import { db } from '../db.js';

export const LikeRepository = {
  add(userId, postId) {
    db.prepare('INSERT OR IGNORE INTO likes (user_id, post_id) VALUES (?, ?)').run(userId, postId);
  },
  remove(userId, postId) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(userId, postId);
  },
  deleteByPost(postId) {
    db.prepare('DELETE FROM likes WHERE post_id = ?').run(postId);
  },
};
