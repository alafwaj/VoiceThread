// /api/search: behind the auth check.
import { Router } from 'express';
import { SearchService } from '../services/SearchService.js';

export const searchRoutes = Router();

searchRoutes.get('/', (req, res) => {
  res.json(SearchService.search(req.query.q, req.user.id));
});
