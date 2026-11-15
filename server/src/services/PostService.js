// Posts, replies and the conversation tree (FR-06 to FR-18, FR-21, FR-23, FR-25).
import { PostRepository } from '../repositories/PostRepository.js';
import { AudioRepository } from '../repositories/AudioRepository.js';
import { TopicRepository } from '../repositories/TopicRepository.js';
import { BookmarkRepository } from '../repositories/BookmarkRepository.js';
import { ReportRepository } from '../repositories/ReportRepository.js';
import { transaction } from '../db.js';
import { AppError } from '../errors.js';

export const MIN_SECONDS = 30;
export const MAX_SECONDS = 300;
export const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4'];

// FR-10: the server refuses recordings that break the rules, and says why.
// The length is the one the browser measured while recording. The server
// checks it is in range; reading the length from the file itself is left
// for later (backlog B-05, see docs/uml/README.md point 3).
function checkRecording(audio, durationSeconds) {
  if (!audio || !audio.buffer?.length) throw new AppError(400, 'Attach a recording.');
  const baseType = String(audio.mimetype || '').split(';')[0].trim().toLowerCase();
  if (!TYPES.includes(baseType)) throw new AppError(400, 'The recording must be WebM, Ogg or MP4 audio.');
  if (audio.buffer.length > MAX_BYTES) throw new AppError(400, 'The recording is larger than 10 MB.');
  const seconds = Number(durationSeconds);
  if (!Number.isFinite(seconds)) throw new AppError(400, 'The recording length is missing.');
  if (seconds < MIN_SECONDS) throw new AppError(400, 'The recording is shorter than 30 seconds.');
  if (seconds > MAX_SECONDS + 1) throw new AppError(400, 'The recording is longer than 5 minutes.');
  return { baseType, seconds: Math.min(MAX_SECONDS, Math.round(seconds)) };
}

// TreeNode: one post with the replies under it (Composite pattern, class.md).
function buildTree(posts) {
  const nodes = new Map(posts.map((p) => [p.id, { post: p, children: [] }]));
  let root = null;
  for (const node of nodes.values()) {
    const parentId = node.post.parentPostId;
    if (parentId && nodes.has(parentId)) nodes.get(parentId).children.push(node);
    else if (!parentId) root = node;
  }
  return root;
}

export const PostService = {
  publish(authorId, audio, { title, description, topicIds, durationSeconds }) {
    const { baseType, seconds } = checkRecording(audio, durationSeconds);
    title = String(title ?? '').trim();
    description = String(description ?? '').trim();
    if (!title) throw new AppError(400, 'An original post needs a title.');
    if (title.length > 100) throw new AppError(400, 'Keep the title under 100 characters.');
    if (description.length > 500) throw new AppError(400, 'Keep the description under 500 characters.');
    const ids = [...new Set((Array.isArray(topicIds) ? topicIds : [topicIds]).filter(Boolean).map(Number))];
    if (ids.length < 1 || ids.length > 3) throw new AppError(400, 'Choose 1 to 3 topics.');
    if (ids.some((id) => !TopicRepository.findById(id))) throw new AppError(400, 'Choose topics from the list.');

    // The file is written first and removed again if the database step fails,
    // so a failed upload leaves no orphaned audio file (NFR-06).
    const fileName = AudioRepository.saveFile(audio.buffer, baseType);
    try {
      return transaction(() => {
        const id = PostRepository.create({ authorId, title, description, audioFile: fileName, audioType: baseType, durationSeconds: seconds });
        TopicRepository.setPostTopics(id, ids);
        return PostRepository.findById(id, authorId);
      });
    } catch (err) {
      AudioRepository.deleteFile(fileName);
      throw err;
    }
  },

  // FR-14: a reply answers one exact post, which must exist and not be deleted (NFR-06).
  reply(parentId, authorId, audio, { durationSeconds }) {
    const parent = PostRepository.findRowById(parentId);
    if (!parent) throw new AppError(404, 'The post you are answering does not exist.');
    if (parent.is_deleted) throw new AppError(400, 'You cannot reply to a deleted post.');
    const { baseType, seconds } = checkRecording(audio, durationSeconds);
    const fileName = AudioRepository.saveFile(audio.buffer, baseType);
    try {
      return transaction(() => {
        const id = PostRepository.create({
          authorId, parentPostId: parent.id, rootPostId: parent.root_post_id ?? parent.id,
          audioFile: fileName, audioType: baseType, durationSeconds: seconds,
        });
        return PostRepository.findById(id, authorId);
      });
    } catch (err) {
      AudioRepository.deleteFile(fileName);
      throw err;
    }
  },

  // FR-11 and FR-18, following "Deleting a post" in class.md.
  deletePost(postId, userId) {
    const post = PostRepository.findRowById(postId);
    if (!post || post.is_deleted) throw new AppError(404, 'This post does not exist.');
    if (post.author_id !== userId) throw new AppError(403, 'You can only delete your own posts.');
    const audioFile = post.audio_file;
    transaction(() => {
      PostRepository.save({ ...post, is_deleted: 1, audio_file: null });
      BookmarkRepository.deleteByPost(postId);
      ReportRepository.closeByPost(postId);
    });
    AudioRepository.deleteFile(audioFile);
  },

  // FR-15 and FR-23: any post id opens its whole conversation.
  getThread(postId, viewerId) {
    const post = PostRepository.findRowById(postId);
    if (!post) throw new AppError(404, 'This post does not exist.');
    const rootId = post.root_post_id ?? post.id;
    const tree = buildTree(PostRepository.getThread(rootId, viewerId));
    if (!tree) throw new AppError(404, 'This conversation does not exist.');
    return { rootId, tree };
  },

  getFeed(userId, page) {
    return PostRepository.findFeed(userId, page);
  },

  getAudio(postId) {
    const post = PostRepository.findRowById(postId);
    if (!post || post.is_deleted || !post.audio_file) throw new AppError(404, 'This recording is not available.');
    const path = AudioRepository.openFile(post.audio_file);
    if (!path) throw new AppError(404, 'This recording is not available.');
    return { path, type: post.audio_type };
  },
};
