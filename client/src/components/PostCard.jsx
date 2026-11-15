// One original post or reply, laid out as in Rayyan's design. Used on the
// feed, the thread page, profiles, topic pages and bookmarks. Every icon
// button has a text label for screen readers (NFR-03).
import { useState } from 'react';
import { api, audioUrl, shortDate } from '../api.js';
import { go, linkTo, shareLink } from '../router.js';
import Avatar from './Avatar.jsx';
import Player from './Player.jsx';
import ReportDialog from './ReportDialog.jsx';
import { useToast } from './Toast.jsx';
import { BookmarkIcon, ChatIcon, FlagIcon, ReplyIcon, ShareIcon, TrashIcon } from './Icons.jsx';

export default function PostCard({ post, me, showOpenThread = true, onChange, onDeleted }) {
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [reporting, setReporting] = useState(false);

  if (post.isDeleted) {
    return (
      <article className="post post-deleted" aria-label="Deleted post">
        <p>Post deleted</p>
        {post.replyCount > 0 && <p className="small">{post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'} below</p>}
      </article>
    );
  }

  const author = post.author;
  const mine = me && author && me.id === author.id;
  const replies = `${post.replyCount} ${post.replyCount === 1 ? 'reply' : 'replies'}`;

  async function toggleBookmark() {
    try {
      if (bookmarked) await api('DELETE', `/bookmarks/${post.id}`);
      else await api('POST', '/bookmarks', { postId: post.id });
      setBookmarked(!bookmarked);
      toast(bookmarked ? 'Bookmark removed' : 'Bookmarked');
      onChange?.();
    } catch (err) {
      toast(err.message);
    }
  }

  async function copyLink() {
    const link = shareLink(post.id);
    try {
      await navigator.clipboard.writeText(link);
      toast('Link copied');
    } catch {
      window.prompt('Copy this link:', link);
    }
  }

  async function remove() {
    if (!window.confirm('Delete this post? Its recording is removed for good. Replies to it stay in the conversation.')) return;
    try {
      await api('DELETE', `/posts/${post.id}`);
      toast('Post deleted');
      onDeleted?.(post.id);
    } catch (err) {
      toast(err.message);
    }
  }

  const label = post.title ? `"${post.title}" by ${author.displayName}` : `reply by ${author.displayName}`;

  return (
    <article className="post" aria-label={label}>
      <header className="post-head">
        <a href={linkTo(`/profile/${author.id}`)} className="post-author">
          <Avatar user={author} size={26} />
          <strong>{author.username}</strong>
        </a>
        <time className="post-date" dateTime={post.createdAt}>{shortDate(post.createdAt)}</time>
      </header>

      {post.title && (
        <h3 className="post-title">
          {showOpenThread ? <a href={linkTo(`/thread/${post.id}`)}>{post.title}</a> : post.title}
        </h3>
      )}
      {post.description && <p className="post-desc">{post.description}</p>}
      {post.topics?.length > 0 && (
        <ul className="chips" aria-label="Topics">
          {post.topics.map((t) => (
            <li key={t.id}><a className="chip" href={linkTo(`/topics/${t.id}`)}>{t.name}</a></li>
          ))}
        </ul>
      )}

      <Player src={audioUrl(post.id)} duration={post.durationSeconds} label={label} seed={post.id} />

      <footer className="post-actions">
        {showOpenThread ? (
          <a className="action" href={linkTo(`/thread/${post.id}`)} aria-label={`${replies}, open the conversation`} title="Open the conversation">
            <ChatIcon /> <span>{post.replyCount}</span>
          </a>
        ) : (
          <span className="action action-static" aria-label={replies} title={replies}><ChatIcon /> <span>{post.replyCount}</span></span>
        )}
        <button type="button" className="action" onClick={() => go(`/record/reply/${post.id}`)} aria-label="Reply with your voice" title="Reply">
          <ReplyIcon /> <span className="action-text">Reply</span>
        </button>
        <button type="button" className="action" onClick={copyLink} aria-label="Copy link to this post" title="Copy link">
          <ShareIcon />
        </button>
        <span className="action-gap" />
        <button type="button" className={`action${bookmarked ? ' action-on' : ''}`} onClick={toggleBookmark} aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Bookmarked' : 'Bookmark'} title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
          <BookmarkIcon filled={bookmarked} />
        </button>
        {mine ? (
          <button type="button" className="action action-danger" onClick={remove} aria-label="Delete this post" title="Delete">
            <TrashIcon />
          </button>
        ) : (
          <button type="button" className="action" onClick={() => setReporting(true)} aria-label="Report this post" title="Report">
            <FlagIcon />
          </button>
        )}
      </footer>

      {reporting && (
        <ReportDialog
          postId={post.id}
          onClose={() => setReporting(false)}
          onDone={() => {
            setReporting(false);
            toast('Report sent to the team');
          }}
        />
      )}
    </article>
  );
}
