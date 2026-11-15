// The private Bookmarks page (FR-22): only the logged-in user's bookmarks, newest first.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import PostList from './PostList.jsx';

export default function Bookmarks({ me }) {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    api('GET', '/bookmarks').then(({ posts: p }) => setPosts(p)).catch((err) => setError(err.message));
  }, []);
  useEffect(load, [load]);
  return (
    <section>
      <h1 className="page-title">Bookmarks</h1>
      <p className="muted small">Only you can see this page.</p>
      <PostList posts={posts} me={me} error={error} onChange={load} onDeleted={load}
        empty={<p>Nothing saved yet. Press Bookmark on any post or reply to keep it here.</p>} />
    </section>
  );
}
