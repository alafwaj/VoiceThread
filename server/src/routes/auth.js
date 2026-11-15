// /api/auth: no login check (component.md).
import { Router } from 'express';
import { AuthService } from '../services/AuthService.js';
import { publicUser } from '../services/UserService.js';
import { COOKIE, readSessionId, requireAuth } from '../middleware/auth.js';
import { SESSION_DAYS } from '../repositories/SessionRepository.js';

export const authRoutes = Router();

function setCookie(res, sessionId) {
  // The session id lives in a cookie, so the user stays logged in after a refresh (FR-02).
  res.cookie(COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', maxAge: SESSION_DAYS * 24 * 3600 * 1000, path: '/' });
}

authRoutes.post('/register', (req, res) => {
  const { username, email, password, displayName } = req.body ?? {};
  const user = AuthService.register(username, email, password, displayName);
  const session = AuthService.login(username, password);
  setCookie(res, session.id);
  res.status(201).json({ user: publicUser(user) });
});

authRoutes.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body ?? {};
  const session = AuthService.login(usernameOrEmail, password);
  setCookie(res, session.id);
  res.json({ user: publicUser(AuthService.checkSession(session.id)) });
});

authRoutes.post('/logout', (req, res) => {
  AuthService.logout(readSessionId(req));
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

authRoutes.get('/me', (req, res) => {
  const user = AuthService.checkSession(readSessionId(req));
  res.json({ user: user ? publicUser(user) : null });
});

authRoutes.post('/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  AuthService.changePassword(req.user.id, readSessionId(req), currentPassword, newPassword);
  res.json({ ok: true });
});
