// Home feed (FR-21): original posts, followed users first, newest first.
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PostList from './PostList.jsx';

export default function Feed({ me }) {
  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('GET', `/posts/feed?page=${page}`)
      .then(({ posts: next }) => {
        setPosts((prev) => (page === 1 ? next : [...(prev || []), ...next]));
        setMore(next.length === 20);
      })
      .catch((err) => setError(err.message));
  }, [page]);

  return (
    <section>
      <h1 className="sr-only">Home</h1>
      <PostList posts={posts} me={me} error={error} onDeleted={(id) => setPosts(posts.filter((p) => p.id !== id))}
        empty={<><p>No posts yet.</p><a className="btn btn-primary" href="#/record">Record the first one</a></>} />
      {more && <button type="button" className="btn btn-outline btn-block" onClick={() => setPage(page + 1)}>Load more</button>}
    </section>
  );
}
