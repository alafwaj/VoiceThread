// Builds the Express app: the route groups from docs/uml/component.md,
// with the auth check in front of every group except /auth and /topics.
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SERVER_ROOT } from './db.js';
import { optionalAuth, requireAuth } from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { postRoutes } from './routes/posts.js';
import { userRoutes } from './routes/users.js';
import { topicRoutes } from './routes/topics.js';
import { followRoutes } from './routes/follows.js';
import { bookmarkRoutes } from './routes/bookmarks.js';
import { reportRoutes } from './routes/reports.js';
import { PHOTO_DIR } from './repositories/PhotoStore.js';
import { AppError } from './errors.js';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/topics', optionalAuth, topicRoutes);
  app.use('/api/posts', requireAuth, postRoutes);
  app.use('/api/users', requireAuth, userRoutes);
  app.use('/api/follows', requireAuth, followRoutes);
  app.use('/api/bookmarks', requireAuth, bookmarkRoutes);
  app.use('/api/reports', requireAuth, reportRoutes);

  // Profile photos are public pictures, like on any profile page.
  app.use('/api/photos', express.static(PHOTO_DIR, { fallthrough: false }));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

  // In production (npm start after npm run build) the server also serves the interface.
  const dist = join(SERVER_ROOT, '..', 'client', 'dist');
  if (existsSync(dist)) {
    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (req, res) => res.sendFile(join(dist, 'index.html')));
  }

  // Every error reaches the user as a clear message, never a crash.
  app.use((err, req, res, next) => {
    if (err instanceof AppError) return res.status(err.status).json({ error: err.message });
    if (err?.status === 404 || err?.statusCode === 404) return res.status(404).json({ error: 'Not found.' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
  });

  return app;
}
