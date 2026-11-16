// The bell: replies to my posts and new followers, newest first.
import { useEffect, useState } from 'react';
import { api, shortDate } from '../api.js';
import { linkTo } from '../router.js';
import Avatar from '../components/Avatar.jsx';

export const SEEN_KEY = 'vt_seen_notifications';

export default function Notifications({ onSeen }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('GET', '/notifications')
      .then(({ notifications }) => {
        setItems(notifications);
        if (notifications[0]) localStorage.setItem(SEEN_KEY, notifications[0].createdAt);
        onSeen?.();
      })
      .catch((err) => setError(err.message));
  }, [onSeen]);

  return (
    <section>
      <h1 className="page-title">Activity</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {items && !items.length && <p className="empty">No activity yet. Replies to your posts and new followers show up here.</p>}
      <ul className="people activity">
        {items?.map((n, i) => (
          <li key={i}>
            <a className="person" href={linkTo(n.type === 'reply' ? `/thread/${n.postId}` : `/profile/${n.userId}`)}>
              <Avatar user={n} size={40} />
              <span>
                <strong>{n.username}</strong>{' '}
                {n.type === 'reply' ? <>replied to {n.parentTitle ? <>“{n.parentTitle}”</> : 'your reply'}</> : 'started following you'}
                <span className="muted small"> · {shortDate(n.createdAt)}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
