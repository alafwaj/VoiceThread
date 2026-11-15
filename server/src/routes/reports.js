// /api/reports: behind the auth check. Listing and resolving are for moderators only.
import { Router } from 'express';
import { ReportService } from '../services/ReportService.js';

export const reportRoutes = Router();

reportRoutes.post('/', (req, res) => {
  ReportService.reportPost(Number(req.body?.postId), req.user.id, req.body?.reason);
  res.status(201).json({ ok: true });
});

reportRoutes.get('/', (req, res) => {
  res.json({ reports: ReportService.listOpenReports(req.user.id) });
});

reportRoutes.post('/:id/resolve', (req, res) => {
  ReportService.resolveReport(Number(req.params.id), req.user.id);
  res.json({ ok: true });
});
