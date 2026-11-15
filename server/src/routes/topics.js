// /api/topics: public and read only, so no login check (component.md).
import { Router } from 'express';
import { TopicService } from '../services/TopicService.js';

export const topicRoutes = Router();

topicRoutes.get('/', (req, res) => {
  res.json({ topics: TopicService.listTopics() });
});

topicRoutes.get('/:id/posts', (req, res) => {
  res.json(TopicService.getTopicPosts(Number(req.params.id), req.user?.id ?? 0));
});
