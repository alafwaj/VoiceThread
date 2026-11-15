// /api/follows: behind the auth check.
import { Router } from 'express';
import { FollowService } from '../services/FollowService.js';

export const followRoutes = Router();

followRoutes.post('/:userId', (req, res) => {
  FollowService.follow(req.user.id, Number(req.params.userId));
  res.json({ ok: true });
});

followRoutes.delete('/:userId', (req, res) => {
  FollowService.unfollow(req.user.id, Number(req.params.userId));
  res.json({ ok: true });
});
