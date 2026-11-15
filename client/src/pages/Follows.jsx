// Followers and Following lists, as in Rayyan's "Followers" screen.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { linkTo } from '../router.js';
import Avatar from '../components/Avatar.jsx';
import { useToast } from '../components/Toast.jsx';
import { BackIcon } from '../components/Icons.jsx';

export default function Follows({ userId, which, me }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api('GET', `/users/${userId}`).then(({ user: u }) => setUser(u)).catch((err) => setError(err.message));
    api('GET', `/users/${userId}/${which}`).then(({ users: list }) => setUsers(list)).catch((err) => setError(err.message));
  }, [userId, which]);

  useEffect(() => {
    setUsers(null);
    setFilter('');
    load();
  }, [load]);

  async function toggle(u) {
    try {
      await api(u.isFollowing ? 'DELETE' : 'POST', `/follows/${u.id}`);
      toast(u.isFollowing ? `You unfollowed ${u.displayName}` : `You follow ${u.displayName}`);
      load();
    } catch (err) {
      toast(err.message);
    }
  }

  const shown = users?.filter((u) => `${u.username} ${u.displayName}`.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <section>
      <div className="page-bar page-bar-center">
        <a className="icon-btn" href={linkTo(`/profile/${userId}`)} aria-label="Back to the profile"><BackIcon /></a>
        <h1 className="page-title">{user ? user.username : ''}</h1>
        <span className="icon-btn" aria-hidden="true" />
      </div>
      <nav className="tabs" aria-label="Followers and following">
        <a href={linkTo(`/profile/${userId}/followers`)} aria-current={which === 'followers' ? 'page' : undefined}>
          <strong>{user?.followers ?? '…'}</strong> {user?.followers === 1 ? 'Follower' : 'Followers'}
        </a>
        <a href={linkTo(`/profile/${userId}/following`)} aria-current={which === 'following' ? 'page' : undefined}>
          <strong>{user?.following ?? '…'}</strong> Following
        </a>
      </nav>
      <label className="search">
        <span className="sr-only">Search {which}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={`Search ${which}`} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      {!users && !error && <p className="muted">Loading…</p>}
      {shown && !shown.length && <p className="empty">{users.length ? 'Nobody matches that search.' : which === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}</p>}
      <ul className="people">
        {shown?.map((u) => (
          <li key={u.id}>
            <a href={linkTo(`/profile/${u.id}`)} className="person">
              <Avatar user={u} size={44} />
              <span><strong>{u.username}</strong><span className="muted small"> {u.displayName}</span></span>
            </a>
            {u.id !== me.id && (
              <button type="button" className={u.isFollowing ? 'pill pill-small' : 'pill pill-small pill-red'} onClick={() => toggle(u)} aria-pressed={u.isFollowing}>
                {u.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
