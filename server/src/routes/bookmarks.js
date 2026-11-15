// /api/bookmarks: behind the auth check.
import { Router } from 'express';
import { BookmarkService } from '../services/BookmarkService.js';

export const bookmarkRoutes = Router();

bookmarkRoutes.get('/', (req, res) => {
  res.json({ posts: BookmarkService.listBookmarks(req.user.id) });
});

bookmarkRoutes.post('/', (req, res) => {
  BookmarkService.addBookmark(req.user.id, Number(req.body?.postId));
  res.status(201).json({ ok: true });
});

bookmarkRoutes.delete('/:postId', (req, res) => {
  BookmarkService.removeBookmark(req.user.id, Number(req.params.postId));
  res.json({ ok: true });
});
