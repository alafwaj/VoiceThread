// Bookmarks (FR-22). Always filtered by the logged-in user.
import { BookmarkRepository } from '../repositories/BookmarkRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { AppError } from '../errors.js';

export const BookmarkService = {
  addBookmark(userId, postId) {
    const post = PostRepository.findRowById(postId);
    if (!post || post.is_deleted) throw new AppError(404, 'This post does not exist.');
    BookmarkRepository.add(userId, postId);
  },
  removeBookmark(userId, postId) {
    BookmarkRepository.remove(userId, postId);
  },
  listBookmarks(userId) {
    return BookmarkRepository.findByUser(userId);
  },
};
