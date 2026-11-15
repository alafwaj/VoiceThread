// Following (FR-20).
import { FollowRepository } from '../repositories/FollowRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { AppError } from '../errors.js';

export const FollowService = {
  follow(followerId, followedUserId) {
    if (followerId === followedUserId) throw new AppError(400, 'You cannot follow yourself.');
    if (!UserRepository.findById(followedUserId)) throw new AppError(404, 'This user does not exist.');
    FollowRepository.add(followerId, followedUserId);
  },
  unfollow(followerId, followedUserId) {
    FollowRepository.remove(followerId, followedUserId);
  },
};
