// /api/users: behind the auth check.
import { Router } from 'express';
import { UserService } from '../services/UserService.js';
import { single } from './upload.js';

export const userRoutes = Router();

userRoutes.patch('/me', single('photo'), (req, res) => {
  const { displayName, bio, removePhoto } = req.body ?? {};
  const user = UserService.updateProfile(req.user.id, { displayName, bio, photo: req.file, removePhoto: removePhoto === 'true' });
  res.json({ user });
});

userRoutes.get('/:id', (req, res) => {
  res.json({ user: UserService.getProfile(Number(req.params.id), req.user.id) });
});

userRoutes.get('/:id/followers', (req, res) => {
  res.json({ users: UserService.getFollowList(Number(req.params.id), 'followers', req.user.id) });
});

userRoutes.get('/:id/following', (req, res) => {
  res.json({ users: UserService.getFollowList(Number(req.params.id), 'following', req.user.id) });
});

userRoutes.get('/:id/posts', (req, res) => {
  res.json({ posts: UserService.getUserPosts(Number(req.params.id), req.user.id) });
});
