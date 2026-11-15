// The only code that reads or writes the posts table.
// Every list returns posts in the same shape, with the author, topics,
// reply count and whether the current user has bookmarked them.
import { db } from '../db.js';

const SELECT = `
  SELECT p.id, p.author_id, p.parent_post_id, p.root_post_id, p.title, p.description,
         p.duration_seconds, p.created_at, p.is_deleted, p.audio_file, p.audio_type,
         u.username AS author_username, u.display_name AS author_display_name, u.photo AS author_photo,
         (SELECT COUNT(*) FROM posts c WHERE c.parent_post_id = p.id) AS reply_count,
         (SELECT group_concat(t.id || ':' || t.name, '|') FROM post_topics pt JOIN topics t ON t.id = pt.topic_id
            WHERE pt.post_id = p.id) AS topic_list,
         EXISTS (SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = :viewer) AS bookmarked,
         (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
         EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = :viewer) AS liked,
         p.listen_count
  FROM posts p JOIN users u ON u.id = p.author_id`;

const PAGE_SIZE = 20; // NFR-05: a feed page has 20 posts

function shape(row) {
  if (!row) return row;
  const deleted = Boolean(row.is_deleted);
  return {
    id: row.id,
    parentPostId: row.parent_post_id,
    rootPostId: row.root_post_id,
    // A deleted post keeps only its place in the tree (FR-18).
    title: deleted ? null : row.title,
    description: deleted ? null : row.description,
    durationSeconds: deleted ? null : row.duration_seconds,
    createdAt: row.created_at,
    isDeleted: deleted,
    replyCount: row.reply_count,
    bookmarked: Boolean(row.bookmarked),
    likeCount: deleted ? 0 : row.like_count,
    liked: Boolean(row.liked),
    listenCount: deleted ? 0 : row.listen_count,
    author: deleted
      ? null
      : { id: row.author_id, username: row.author_username, displayName: row.author_display_name, photo: row.author_photo },
    topics: deleted || !row.topic_list
      ? []
      : row.topic_list.split('|').map((s) => {
          const i = s.indexOf(':');
          return { id: Number(s.slice(0, i)), name: s.slice(i + 1) };
        }),
  };
}

export const PostRepository = {
  PAGE_SIZE,
  // Raw row with the private fields, for the services.
  findRowById(id) {
    return db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  },
  findById(id, viewerId = 0) {
    return shape(db.prepare(`${SELECT} WHERE p.id = :id`).get({ id, viewer: viewerId }));
  },
  create({ authorId, parentPostId, rootPostId, title, description, audioFile, audioType, durationSeconds }) {
    const r = db
      .prepare(`INSERT INTO posts (author_id, parent_post_id, root_post_id, title, description, audio_file, audio_type, duration_seconds)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(authorId, parentPostId ?? null, rootPostId ?? null, title ?? null, description ?? null, audioFile, audioType, durationSeconds);
    const id = Number(r.lastInsertRowid);
    // An original post is its own root.
    if (!parentPostId) db.prepare('UPDATE posts SET root_post_id = ? WHERE id = ?').run(id, id);
    return id;
  },
  save(post) {
    db.prepare('UPDATE posts SET is_deleted = ?, audio_file = ? WHERE id = ?').run(post.is_deleted ? 1 : 0, post.audio_file ?? null, post.id);
  },
  // Every post of one conversation, in one query (design.md section 4).
  getThread(rootId, viewerId = 0) {
    return db.prepare(`${SELECT} WHERE p.root_post_id = :root ORDER BY p.created_at, p.id`).all({ root: rootId, viewer: viewerId }).map(shape);
  },
  // FR-21: original posts only, followed users first, newest first in each group.
  findFeed(userId, page = 1) {
    return db
      .prepare(`${SELECT}
        WHERE p.parent_post_id IS NULL AND p.is_deleted = 0
        ORDER BY (p.author_id IN (SELECT followed_user_id FROM follows WHERE follower_id = :viewer)) DESC,
                 p.created_at DESC, p.id DESC
        LIMIT :limit OFFSET :offset`)
      .all({ viewer: userId, limit: PAGE_SIZE, offset: (Math.max(1, page) - 1) * PAGE_SIZE })
      .map(shape);
  },
  // FR-04: a profile lists the user's original posts, not replies.
  findByAuthor(userId, viewerId = 0) {
    return db
      .prepare(`${SELECT} WHERE p.author_id = :author AND p.parent_post_id IS NULL AND p.is_deleted = 0 ORDER BY p.created_at DESC, p.id DESC`)
      .all({ author: userId, viewer: viewerId })
      .map(shape);
  },
  // FR-19: original posts tagged with a topic, newest first.
  findByTopic(topicId, viewerId = 0) {
    return db
      .prepare(`${SELECT} JOIN post_topics pt ON pt.post_id = p.id
                WHERE pt.topic_id = :topic AND p.is_deleted = 0 ORDER BY p.created_at DESC, p.id DESC`)
      .all({ topic: topicId, viewer: viewerId })
      .map(shape);
  },
  addListen(id) {
    db.prepare('UPDATE posts SET listen_count = listen_count + 1 WHERE id = ? AND is_deleted = 0').run(id);
  },
  // Search: original posts whose title matches, newest first.
  searchByTitle(text, viewerId = 0) {
    return db
      .prepare(`${SELECT} WHERE p.parent_post_id IS NULL AND p.is_deleted = 0 AND p.title LIKE :q ESCAPE '\\'
                ORDER BY p.created_at DESC, p.id DESC LIMIT 20`)
      .all({ q: text, viewer: viewerId })
      .map(shape);
  },
  // FR-22: the user's bookmarks, most recently added first.
  findBookmarkedBy(userId) {
    return db
      .prepare(`${SELECT} JOIN bookmarks bm ON bm.post_id = p.id AND bm.user_id = :viewer
                WHERE p.is_deleted = 0 ORDER BY bm.created_at DESC, bm.rowid DESC`)
      .all({ viewer: userId })
      .map(shape);
  },
};
