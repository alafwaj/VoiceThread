// Profiles (FR-04, FR-05).
import { UserRepository } from '../repositories/UserRepository.js';
import { FollowRepository } from '../repositories/FollowRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { PhotoStore } from '../repositories/PhotoStore.js';
import { AppError } from '../errors.js';

export function publicUser(u) {
  return u && { id: u.id, username: u.username, displayName: u.display_name, photo: u.photo, bio: u.bio, role: u.role, createdAt: u.created_at };
}

export const UserService = {
  getProfile(userId, viewerId) {
    const user = UserRepository.findById(userId);
    if (!user) throw new AppError(404, 'This user does not exist.');
    return {
      ...publicUser(user),
      followers: FollowRepository.countFollowers(userId),
      following: FollowRepository.countFollowing(userId),
      isFollowing: viewerId ? FollowRepository.isFollowing(viewerId, userId) : false,
      isMe: viewerId === userId,
    };
  },

  getUserPosts(userId, viewerId) {
    if (!UserRepository.findById(userId)) throw new AppError(404, 'This user does not exist.');
    return PostRepository.findByAuthor(userId, viewerId);
  },

  getFollowList(userId, which, viewerId) {
    if (!UserRepository.findById(userId)) throw new AppError(404, 'This user does not exist.');
    return which === 'following'
      ? FollowRepository.listFollowing(userId, viewerId)
      : FollowRepository.listFollowers(userId, viewerId);
  },

  // A user can only change their own profile: the route always passes the logged-in user's id (FR-05).
  updateProfile(userId, { displayName, bio, photo, removePhoto }) {
    const user = UserRepository.findById(userId);
    const name = displayName === undefined ? user.display_name : String(displayName).trim();
    if (!name) throw new AppError(400, 'The display name cannot be empty.');
    if (name.length > 50) throw new AppError(400, 'Keep the display name under 50 characters.');
    const newBio = bio === undefined ? user.bio : String(bio).trim();
    if (newBio.length > 300) throw new AppError(400, 'Keep the bio under 300 characters.');
    let newPhoto = user.photo;
    if (photo) {
      if (!PhotoStore.isAllowed(photo.mimetype)) throw new AppError(400, 'The photo must be a JPEG, PNG, WebP or GIF image.');
      newPhoto = PhotoStore.save(photo.buffer, photo.mimetype);
      PhotoStore.delete(user.photo);
    } else if (removePhoto) {
      PhotoStore.delete(user.photo);
      newPhoto = null;
    }
    return publicUser(UserRepository.save({ ...user, display_name: name, bio: newBio, photo: newPhoto }));
  },
};
