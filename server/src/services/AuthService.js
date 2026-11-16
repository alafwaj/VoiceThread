// Accounts and sessions (FR-01 to FR-03, NFR-04).
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';
import { AppError } from '../errors.js';

// Only a salted hash of the password is stored, never the password (FR-01, NFR-04).
function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const given = scryptSync(password, salt, 64);
  return timingSafeEqual(given, Buffer.from(hash, 'hex'));
}

export const AuthService = {
  register(username, email, password, displayName) {
    username = String(username ?? '').trim();
    email = String(email ?? '').trim().toLowerCase();
    displayName = String(displayName ?? '').trim() || username;
    if (!/^[A-Za-z0-9_.]{3,30}$/.test(username)) {
      throw new AppError(400, 'Choose a username of 3 to 30 letters, numbers, dots or underscores.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AppError(400, 'Enter a valid email address.');
    if (String(password ?? '').length < 8) throw new AppError(400, 'The password must be at least 8 characters.');
    const taken = UserRepository.exists(username, email);
    if (taken.some((u) => u.username.toLowerCase() === username.toLowerCase())) throw new AppError(409, 'That username is already taken.');
    if (taken.length) throw new AppError(409, 'An account with that email already exists.');
    return UserRepository.create({ username, email, passwordHash: hashPassword(password), displayName });
  },

  login(usernameOrEmail, password) {
    const user = UserRepository.findByUsernameOrEmail(String(usernameOrEmail ?? '').trim());
    if (!user || !checkPassword(String(password ?? ''), user.password_hash)) {
      throw new AppError(401, 'Wrong username, email or password.');
    }
    return SessionRepository.create(user.id);
  },

  // Settings > Change password. Other devices are logged out afterwards.
  changePassword(userId, sessionId, currentPassword, newPassword) {
    const user = UserRepository.findWithPasswordById(userId);
    if (!checkPassword(String(currentPassword ?? ''), user.password_hash)) throw new AppError(400, 'Your current password is wrong.');
    if (String(newPassword ?? '').length < 8) throw new AppError(400, 'The new password must be at least 8 characters.');
    if (newPassword === currentPassword) throw new AppError(400, 'Choose a password different from your current one.');
    UserRepository.setPasswordHash(userId, hashPassword(newPassword));
    SessionRepository.deleteOthers(userId, sessionId);
  },

  logout(sessionId) {
    if (sessionId) SessionRepository.delete(sessionId);
  },

  // Called by the auth check in front of the protected routes.
  checkSession(sessionId) {
    if (!sessionId) return null;
    const session = SessionRepository.findById(sessionId);
    if (!session) return null;
    if (session.expired) {
      SessionRepository.delete(sessionId);
      return null;
    }
    return UserRepository.findById(session.user_id) ?? null;
  },
};
