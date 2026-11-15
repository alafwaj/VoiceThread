// Reporting a post (backlog B-20, an extra). Only moderators see and resolve reports.
import { ReportRepository } from '../repositories/ReportRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { AppError } from '../errors.js';

function checkModerator(userId) {
  const user = UserRepository.findById(userId);
  if (!user || user.role !== 'moderator') throw new AppError(403, 'Only moderators can do this.');
}

export const ReportService = {
  reportPost(postId, reporterId, reason) {
    reason = String(reason ?? '').trim();
    if (reason.length < 5) throw new AppError(400, 'Write a short reason (at least 5 characters).');
    if (reason.length > 500) throw new AppError(400, 'Keep the reason under 500 characters.');
    const post = PostRepository.findRowById(postId);
    if (!post || post.is_deleted) throw new AppError(404, 'This post does not exist.');
    ReportRepository.save({ postId, reporterId, reason });
  },
  listOpenReports(userId) {
    checkModerator(userId);
    return ReportRepository.findOpen();
  },
  resolveReport(reportId, userId) {
    checkModerator(userId);
    const report = ReportRepository.findById(reportId);
    if (!report) throw new AppError(404, 'This report does not exist.');
    return ReportRepository.markResolved(reportId, userId);
  },
};
