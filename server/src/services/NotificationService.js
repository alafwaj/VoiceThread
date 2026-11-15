// The bell: replies to the user's posts and new followers.
import { NotificationRepository } from '../repositories/NotificationRepository.js';

export const NotificationService = {
  list(userId) {
    return NotificationRepository.forUser(userId);
  },
};
