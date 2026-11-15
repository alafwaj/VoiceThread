// /api/posts: behind the auth check.
import { Router } from 'express';
import { PostService } from '../services/PostService.js';
import { single } from './upload.js';

export const postRoutes = Router();

postRoutes.get('/feed', (req, res) => {
  res.json({ posts: PostService.getFeed(req.user.id, Number(req.query.page) || 1) });
});

postRoutes.post('/', single('audio'), (req, res) => {
  const { title, description, durationSeconds } = req.body ?? {};
  const topicIds = req.body?.topicIds ?? req.body?.['topicIds[]'];
  const post = PostService.publish(req.user.id, req.file, { title, description, topicIds, durationSeconds });
  res.status(201).json({ post });
});

postRoutes.post('/:id/replies', single('audio'), (req, res) => {
  const post = PostService.reply(Number(req.params.id), req.user.id, req.file, { durationSeconds: req.body?.durationSeconds });
  res.status(201).json({ post });
});

postRoutes.get('/:id/thread', (req, res) => {
  res.json(PostService.getThread(Number(req.params.id), req.user.id));
});

postRoutes.delete('/:id', (req, res) => {
  PostService.deletePost(Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// Audio is only served through this checked request. sendFile supports
// Range requests, so the player's progress bar can seek (FR-12).
postRoutes.get('/:id/audio', (req, res, next) => {
  const { path, type } = PostService.getAudio(Number(req.params.id));
  res.type(type);
  res.sendFile(path, (err) => err && !res.headersSent && next(err));
});
