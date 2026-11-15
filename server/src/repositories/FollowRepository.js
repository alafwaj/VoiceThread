// The only code that reads or writes the follows table.
import { db } from '../db.js';

export const FollowRepository = {
  add(followerId, followedUserId) {
    db.prepare('INSERT OR IGNORE INTO follows (follower_id, followed_user_id) VALUES (?, ?)').run(followerId, followedUserId);
  },
  remove(followerId, followedUserId) {
    db.prepare('DELETE FROM follows WHERE follower_id = ? AND followed_user_id = ?').run(followerId, followedUserId);
  },
  isFollowing(followerId, followedUserId) {
    return Boolean(db.prepare('SELECT 1 FROM follows WHERE follower_id = ? AND followed_user_id = ?').get(followerId, followedUserId));
  },
  findFollowedIds(userId) {
    return db.prepare('SELECT followed_user_id AS id FROM follows WHERE follower_id = ?').all(userId).map((r) => r.id);
  },
  // The people who follow a user, or whom a user follows, with whether the
  // viewer follows each of them (for the Followers and Following page).
  listFollowers(userId, viewerId) {
    return db.prepare(`SELECT u.id, u.username, u.display_name AS displayName, u.photo,
        EXISTS (SELECT 1 FROM follows v WHERE v.follower_id = :viewer AND v.followed_user_id = u.id) AS isFollowing
      FROM follows f JOIN users u ON u.id = f.follower_id WHERE f.followed_user_id = :user ORDER BY f.created_at DESC`)
      .all({ user: userId, viewer: viewerId }).map((r) => ({ ...r, isFollowing: Boolean(r.isFollowing) }));
  },
  listFollowing(userId, viewerId) {
    return db.prepare(`SELECT u.id, u.username, u.display_name AS displayName, u.photo,
        EXISTS (SELECT 1 FROM follows v WHERE v.follower_id = :viewer AND v.followed_user_id = u.id) AS isFollowing
      FROM follows f JOIN users u ON u.id = f.followed_user_id WHERE f.follower_id = :user ORDER BY f.created_at DESC`)
      .all({ user: userId, viewer: viewerId }).map((r) => ({ ...r, isFollowing: Boolean(r.isFollowing) }));
  },
  // Counted, not stored (FR-04).
  countFollowers(userId) {
    return db.prepare('SELECT COUNT(*) AS n FROM follows WHERE followed_user_id = ?').get(userId).n;
  },
  countFollowing(userId) {
    return db.prepare('SELECT COUNT(*) AS n FROM follows WHERE follower_id = ?').get(userId).n;
  },
};
