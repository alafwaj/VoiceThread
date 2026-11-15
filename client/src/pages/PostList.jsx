// A list of posts with loading, empty and error states.
import PostCard from '../components/PostCard.jsx';

export default function PostList({ posts, me, error, empty, onChange, onDeleted }) {
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!posts) return <p className="muted" aria-live="polite">Loading…</p>;
  if (!posts.length) return <div className="empty">{empty}</div>;
  return (
    <div className="stack">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} me={me} onChange={onChange} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
