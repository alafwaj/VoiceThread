// Builds the activity list for the bell from existing data: replies to the
// user's posts and people who started following them. Nothing extra is stored.
import { db } from '../db.js';

export const NotificationRepository = {
  forUser(userId) {
    return db
      .prepare(`
        SELECT 'reply' AS type, r.id AS postId, r.created_at AS createdAt,
               u.id AS userId, u.username, u.display_name AS displayName, u.photo,
               p.title AS parentTitle, p.id AS parentId
        FROM posts r JOIN posts p ON p.id = r.parent_post_id JOIN users u ON u.id = r.author_id
        WHERE p.author_id = :me AND r.author_id <> :me AND r.is_deleted = 0
        UNION ALL
        SELECT 'follow', NULL, f.created_at, u.id, u.username, u.display_name, u.photo, NULL, NULL
        FROM follows f JOIN users u ON u.id = f.follower_id
        WHERE f.followed_user_id = :me
        ORDER BY createdAt DESC LIMIT 40`)
      .all({ me: userId });
  },
};
