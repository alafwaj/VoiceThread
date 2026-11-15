// The only code that reads or writes the bookmarks table.
import { db } from '../db.js';
import { PostRepository } from './PostRepository.js';

export const BookmarkRepository = {
  add(userId, postId) {
    db.prepare('INSERT OR IGNORE INTO bookmarks (user_id, post_id) VALUES (?, ?)').run(userId, postId);
  },
  remove(userId, postId) {
    db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?').run(userId, postId);
  },
  findByUser(userId) {
    return PostRepository.findBookmarkedBy(userId);
  },
  deleteByPost(postId) {
    db.prepare('DELETE FROM bookmarks WHERE post_id = ?').run(postId);
  },
};
