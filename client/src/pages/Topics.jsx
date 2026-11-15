// The topics page and one page per topic (FR-19).
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { linkTo } from '../router.js';
import PostList from './PostList.jsx';
import { BackIcon } from '../components/Icons.jsx';

export function TopicList() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api('GET', '/topics').then(({ topics: t }) => setTopics(t)).catch((err) => setError(err.message));
  }, []);
  return (
    <section>
      <h1 className="page-title">Topics</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {!topics && !error && <p className="muted">Loading…</p>}
      <ul className="topic-grid">
        {topics?.map((t) => (
          <li key={t.id}><a className="topic-tile" href={linkTo(`/topics/${t.id}`)}>{t.name}</a></li>
        ))}
      </ul>
    </section>
  );
}

export function TopicPage({ topicId, me }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null);
    api('GET', `/topics/${topicId}/posts`).then(setData).catch((err) => setError(err.message));
  }, [topicId]);
  return (
    <section>
      <div className="page-bar">
        <a className="icon-btn" href={linkTo('/topics')} aria-label="All topics"><BackIcon /></a>
        <h1 className="page-title">{data?.topic.name ?? 'Topic'}</h1>
      </div>
      <p className="muted small">Original posts in this topic, newest first.</p>
      <PostList posts={data?.posts} me={me} error={error}
        onDeleted={(id) => setData({ ...data, posts: data.posts.filter((p) => p.id !== id) })}
        empty={<p>No posts in this topic yet.</p>} />
    </section>
  );
}
