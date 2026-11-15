// /api/notifications: behind the auth check.
import { Router } from 'express';
import { NotificationService } from '../services/NotificationService.js';

export const notificationRoutes = Router();

notificationRoutes.get('/', (req, res) => {
  res.json({ notifications: NotificationService.list(req.user.id) });
});
