// The auth check in front of the protected route groups (component.md).
// It calls AuthService.checkSession, which looks the session up through
// SessionRepository, and refuses the request if nobody is logged in (FR-03, NFR-04).
import { AuthService } from '../services/AuthService.js';

export const COOKIE = 'vt_session';

export function readSessionId(req) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Sets req.user when someone is logged in, but lets the request through either way.
export function optionalAuth(req, res, next) {
  req.user = AuthService.checkSession(readSessionId(req));
  next();
}

export function requireAuth(req, res, next) {
  req.user = AuthService.checkSession(readSessionId(req));
  if (!req.user) return res.status(401).json({ error: 'Please log in first.' });
  next();
}
