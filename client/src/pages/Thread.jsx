// The conversation tree (FR-15 to FR-18, FR-23, FR-25), as in wireframe 03.
// The server builds the tree; collapsing a branch only changes this screen.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.js';
import { go } from '../router.js';
import PostCard from '../components/PostCard.jsx';
import { BackIcon, UpIcon } from '../components/Icons.jsx';

// Counts every reply under a node, shown when the branch is collapsed (FR-17).
function hiddenCount(node) {
  return node.children.reduce((n, c) => n + 1 + hiddenCount(c), 0);
}

function index(node, parent, map = new Map()) {
  map.set(node.post.id, { node, parent });
  node.children.forEach((c) => index(c, node, map));
  return map;
}

function Branch({ node, depth, me, selectedId, onSelect, collapsed, toggle, refresh }) {
  const id = node.post.id;
  const isCollapsed = collapsed.has(id);
  const selected = selectedId === id;
  const count = node.children.length;
  return (
    <li className="branch" style={{ '--depth': Math.min(depth, 6) }}>
      <div
        id={`post-${id}`}
        className={`node${selected ? ' node-selected' : ''}`}
        onClick={(e) => {
          if (!e.target.closest('a, button, input, select, textarea')) onSelect(id);
        }}
        onFocus={() => onSelect(id)}
        tabIndex={-1}
      >
        {selected && <span className="selected-tag">Selected</span>}
        <PostCard post={node.post} me={me} showOpenThread={false} onDeleted={refresh} onChange={refresh} />
        {count > 0 && (
          <button type="button" className="collapse-btn" onClick={() => toggle(id)} aria-expanded={!isCollapsed}>
            {isCollapsed ? `Show ${hiddenCount(node)} hidden ${hiddenCount(node) === 1 ? 'reply' : 'replies'}` : `Hide ${count === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
      </div>
      {count > 0 && !isCollapsed && (
        <ul className="branch-list" aria-label={`Replies to post ${id}`}>
          {node.children.map((c) => (
            <Branch key={c.post.id} node={c} depth={depth + 1} me={me} selectedId={selectedId} onSelect={onSelect}
              collapsed={collapsed} toggle={toggle} refresh={refresh} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Thread({ postId, me }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(postId);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const scrolled = useRef(false);

  const load = useCallback(() => {
    api('GET', `/posts/${postId}/thread`).then(setData).catch((err) => setError(err.message));
  }, [postId]);

  useEffect(() => {
    scrolled.current = false;
    setSelectedId(postId);
    setData(null);
    load();
  }, [postId, load]);

  const map = useMemo(() => (data ? index(data.tree, null) : new Map()), [data]);

  // Opening a shared link shows the thread with that recording highlighted (FR-23).
  useEffect(() => {
    if (!data || scrolled.current) return;
    scrolled.current = true;
    // Make sure every branch above the linked post is open.
    const open = new Set(collapsed);
    let entry = map.get(postId);
    while (entry?.parent) {
      open.delete(entry.parent.post.id);
      entry = map.get(entry.parent.post.id);
    }
    setCollapsed(open);
    requestAnimationFrame(() => document.getElementById(`post-${postId}`)?.scrollIntoView({ block: 'center' }));
  }, [data, map, postId, collapsed]);

  const select = useCallback((id) => setSelectedId(id), []);

  function moveTo(id) {
    setSelectedId(id);
    // Open the branch so the post can be seen.
    setCollapsed((prev) => {
      const next = new Set(prev);
      let e = map.get(id);
      while (e?.parent) {
        next.delete(e.parent.post.id);
        e = map.get(e.parent.post.id);
      }
      return next;
    });
    requestAnimationFrame(() => {
      const el = document.getElementById(`post-${id}`);
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el?.focus({ preventScroll: true });
    });
  }

  function toggle(id) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!data) return <p className="muted" aria-live="polite">Loading the conversation…</p>;

  const selected = map.get(selectedId);
  const parent = selected?.parent;
  const children = selected?.node.children ?? [];

  return (
    <section>
      <div className="page-bar">
        <button type="button" className="icon-btn" onClick={() => window.history.back()} aria-label="Go back"><BackIcon /></button>
        <h1 className="page-title">Conversation</h1>
      </div>

      {selected && (parent || children.length > 0) && (
        <nav className="tree-nav" aria-label="Move around the conversation">
          <span className="small muted">From the selected post:</span>
          <button type="button" className="btn btn-small btn-outline" disabled={!parent} onClick={() => moveTo(parent.post.id)}>
            <UpIcon /> Post it answers
          </button>
          {children.map((c, i) => (
            <button key={c.post.id} type="button" className="btn btn-small btn-ghost" onClick={() => moveTo(c.post.id)}>
              Reply {i + 1}{c.post.author ? ` by ${c.post.author.displayName}` : ''}
            </button>
          ))}
        </nav>
      )}

      <ul className="tree" aria-label="Conversation tree">
        <Branch node={data.tree} depth={0} me={me} selectedId={selectedId} onSelect={select} collapsed={collapsed} toggle={toggle}
          refresh={load} />
      </ul>
      <button type="button" className="btn btn-primary btn-block" onClick={() => go(`/record/reply/${selectedId}`)}
        disabled={selected?.node.post.isDeleted}>
        Reply to the selected post
      </button>
    </section>
  );
}
