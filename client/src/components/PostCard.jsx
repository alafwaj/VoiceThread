// One original post or reply, laid out like Rayyan's Figma: the speaker and
// date, the player, then likes, replies and share on the left and listens on
// the right. Bookmark, report and delete are in the "more" menu (⋯).
// Every icon button has a text label for screen readers (NFR-03).
import { useEffect, useRef, useState } from 'react';
import { api, audioUrl, shortDate } from '../api.js';
import { go, linkTo, shareLink } from '../router.js';
import Avatar from './Avatar.jsx';
import Player from './Player.jsx';
import ReportDialog from './ReportDialog.jsx';
import { useToast } from './Toast.jsx';
import { BookmarkIcon, ChatIcon, FlagIcon, HeadphonesIcon, HeartIcon, MoreIcon, ShareIcon, TrashIcon } from './Icons.jsx';

function compact(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}k`;
  return String(n);
}

function MoreMenu({ items }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !box.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  return (
    <span className="more" ref={box}>
      <button type="button" className="action" aria-label="More actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <MoreIcon />
      </button>
      {open && (
        <span className="more-menu" role="menu">
          {items.map((it) => (
            <button key={it.label} type="button" role="menuitem" className={it.danger ? 'danger' : ''} onClick={() => { setOpen(false); it.onClick(); }}>
              {it.icon} {it.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

export default function PostCard({ post, me, showOpenThread = true, onChange, onDeleted }) {
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likeCount ?? 0);
  const [listens, setListens] = useState(post.listenCount ?? 0);
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

  async function toggleLike() {
    try {
      const { post: p } = await api(liked ? 'DELETE' : 'POST', `/posts/${post.id}/like`);
      setLiked(p.liked);
      setLikes(p.likeCount);
    } catch (err) {
      toast(err.message);
    }
  }

  function countListen() {
    api('POST', `/posts/${post.id}/listens`).then(() => setListens((n) => n + 1)).catch(() => {});
  }

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

  const label = post.title ? `"${post.title}" by ${author.username}` : `reply by ${author.username}`;
  const menu = [
    { label: bookmarked ? 'Remove bookmark' : 'Bookmark', icon: <BookmarkIcon filled={bookmarked} />, onClick: toggleBookmark },
    mine
      ? { label: 'Delete', icon: <TrashIcon />, onClick: remove, danger: true }
      : { label: 'Report', icon: <FlagIcon />, onClick: () => setReporting(true) },
  ];

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

      <Player src={audioUrl(post.id)} duration={post.durationSeconds} label={label} seed={post.id} onFirstPlay={countListen} />

      <footer className="post-actions">
        <button type="button" className={`action${liked ? ' action-on' : ''}`} onClick={toggleLike} aria-pressed={liked}
          aria-label={`${liked ? 'Unlike' : 'Like'}, ${likes} ${likes === 1 ? 'like' : 'likes'}`} title={liked ? 'Unlike' : 'Like'}>
          <HeartIcon filled={liked} /><span>{compact(likes)}</span>
        </button>
        <button type="button" className="action" title={showOpenThread ? 'Open the conversation' : 'Reply with your voice'}
          aria-label={showOpenThread ? `${replies}, open the conversation` : `${replies}, reply with your voice`}
          onClick={() => go(showOpenThread ? `/thread/${post.id}` : `/record/reply/${post.id}`)}>
          <ChatIcon /><span>{compact(post.replyCount)}</span>
        </button>
        <button type="button" className="action" onClick={copyLink} aria-label="Copy link to this post" title="Share">
          <ShareIcon />
        </button>
        <MoreMenu items={menu} />
        <span className="action-gap" />
        <span className="listens" aria-label={`${listens} ${listens === 1 ? 'listen' : 'listens'}`} title="Listens">
          <HeadphonesIcon /><span>{compact(listens)}</span>
        </span>
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
