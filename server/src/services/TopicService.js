// Topics (FR-19). Public and read only.
import { TopicRepository } from '../repositories/TopicRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { AppError } from '../errors.js';

export const TopicService = {
  listTopics() {
    return TopicRepository.findAll();
  },
  getTopicPosts(topicId, viewerId = 0) {
    const topic = TopicRepository.findById(topicId);
    if (!topic) throw new AppError(404, 'This topic does not exist.');
    return { topic, posts: PostRepository.findByTopic(topicId, viewerId) };
  },
};
