// Search (backlog B-18), as in Rayyan's "Search bar" screen: a back button and
// a round search box at the top. Finds users, post titles and topics.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { linkTo } from '../router.js';
import Avatar from '../components/Avatar.jsx';
import PostList from './PostList.jsx';
import { ArrowLeftIcon, SearchIcon } from '../components/Icons.jsx';

export default function Search({ me }) {
  const [q, setQ] = useState(() => sessionStorage.getItem('vt_search') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.setItem('vt_search', q);
    if (!q.trim()) {
      setResult(null);
      return undefined;
    }
    const t = setTimeout(() => {
      api('GET', `/search?q=${encodeURIComponent(q.trim())}`).then(setResult).catch((err) => setError(err.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const nothing = result && !result.users.length && !result.posts.length && !result.topics.length;

  return (
    <section>
      <h1 className="sr-only">Search</h1>
      <div className="search-top">
        <button type="button" className="round-btn" onClick={() => window.history.back()} aria-label="Go back"><ArrowLeftIcon /></button>
        <label className="search search-big">
          <span className="sr-only">Search users, posts and topics</span>
          <SearchIcon />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" autoFocus type="search" />
        </label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!q.trim() && <p className="muted center pad">Search for people, post titles or topics.</p>}
      {nothing && <p className="muted center pad">Nothing found for “{q.trim()}”.</p>}
      {result?.users.length > 0 && (
        <>
          <h2 className="search-head">People</h2>
          <ul className="people">
            {result.users.map((u) => (
              <li key={u.id}>
                <a href={linkTo(`/profile/${u.id}`)} className="person">
                  <Avatar user={u} size={40} />
                  <span><strong>{u.username}</strong><span className="muted small"> {u.displayName}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {result?.topics.length > 0 && (
        <>
          <h2 className="search-head">Topics</h2>
          <ul className="chips">
            {result.topics.map((t) => <li key={t.id}><a className="chip" href={linkTo(`/topics/${t.id}`)}>{t.name}</a></li>)}
          </ul>
        </>
      )}
      {result?.posts.length > 0 && (
        <>
          <h2 className="search-head">Posts</h2>
          <PostList posts={result.posts} me={me} />
        </>
      )}
    </section>
  );
}
