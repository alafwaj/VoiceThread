// Open reports, for moderators only (backlog B-20, an extra).
import { useCallback, useEffect, useState } from 'react';
import { api, timeAgo } from '../api.js';
import { linkTo } from '../router.js';

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    api('GET', '/reports').then(({ reports: r }) => setReports(r)).catch((err) => setError(err.message));
  }, []);
  useEffect(load, [load]);

  async function resolve(id) {
    try {
      await api('POST', `/reports/${id}/resolve`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h1 className="page-title">Open reports</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {reports && !reports.length && <div className="empty"><p>No open reports.</p></div>}
      <ul className="stack">
        {reports?.map((r) => (
          <li key={r.id} className="card">
            <p className="small muted">Report #{r.id} · {timeAgo(r.createdAt)}</p>
            <p><strong>Reason:</strong> {r.reason}</p>
            <div className="row">
              <a className="btn btn-outline btn-small" href={linkTo(`/thread/${r.postId}`)}>Open the post</a>
              <button type="button" className="btn btn-primary btn-small" onClick={() => resolve(r.id)}>Mark resolved</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
