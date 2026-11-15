// The only code that reads or writes the reports table.
import { db } from '../db.js';

export const ReportRepository = {
  save({ postId, reporterId, reason }) {
    const r = db.prepare('INSERT INTO reports (post_id, reporter_id, reason) VALUES (?, ?, ?)').run(postId, reporterId, reason);
    return this.findById(Number(r.lastInsertRowid));
  },
  findById(id) {
    return db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  },
  // reporter_id stays private: only moderators see open reports (class.md, Privacy).
  findOpen() {
    return db
      .prepare(`SELECT r.id, r.post_id AS postId, r.reason, r.status, r.created_at AS createdAt,
                       p.title AS postTitle, p.root_post_id AS rootPostId, p.is_deleted AS postDeleted
                FROM reports r JOIN posts p ON p.id = r.post_id
                WHERE r.status = 'open' ORDER BY r.created_at, r.id`)
      .all();
  },
  markResolved(reportId, moderatorId) {
    db.prepare(`UPDATE reports SET status = 'resolved', resolved_by = ?, resolved_at = datetime('now') WHERE id = ?`).run(moderatorId, reportId);
    return this.findById(reportId);
  },
  // When a post is deleted its reports are closed but kept as a record.
  closeByPost(postId) {
    db.prepare(`UPDATE reports SET status = 'closed', resolved_at = datetime('now') WHERE post_id = ? AND status = 'open'`).run(postId);
  },
};
