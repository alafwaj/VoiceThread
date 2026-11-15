// The only code that reads or writes the topics and post_topics tables.
import { db } from '../db.js';

export const TopicRepository = {
  findAll() {
    return db.prepare('SELECT id, name FROM topics ORDER BY name').all();
  },
  findById(id) {
    return db.prepare('SELECT id, name FROM topics WHERE id = ?').get(id);
  },
  setPostTopics(postId, topicIds) {
    const insert = db.prepare('INSERT INTO post_topics (post_id, topic_id) VALUES (?, ?)');
    for (const topicId of topicIds) insert.run(postId, topicId);
  },
};
