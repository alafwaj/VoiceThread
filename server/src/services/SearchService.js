// Search (backlog B-18): users, original post titles and topics.
// It searches names and titles only, not the words spoken in recordings.
import { UserRepository } from '../repositories/UserRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { TopicRepository } from '../repositories/TopicRepository.js';
import { publicUser } from './UserService.js';

export const SearchService = {
  search(query, viewerId) {
    const text = String(query ?? '').trim().slice(0, 50);
    if (!text) return { users: [], posts: [], topics: [] };
    const like = `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const lower = text.toLowerCase();
    return {
      users: UserRepository.search(like).map(publicUser),
      posts: PostRepository.searchByTitle(like, viewerId),
      topics: TopicRepository.findAll().filter((t) => t.name.toLowerCase().includes(lower)),
    };
  },
};
