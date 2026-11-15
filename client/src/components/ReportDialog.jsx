// Report a post with a written reason (backlog B-20, an extra).
import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';

export default function ReportDialog({ postId, onClose, onDone }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    box.current?.querySelector('textarea')?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('POST', '/reports', { postId, reason });
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <form className="dialog" ref={box} role="dialog" aria-modal="true" aria-labelledby="report-title" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h2 id="report-title">Report this post</h2>
        <p className="muted">Tell the team what is wrong. Your name is not shown to the person who posted it.</p>
        <label className="field">
          <span>Reason</span>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={500} required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={busy || reason.trim().length < 5}>Send report</button>
        </div>
      </form>
    </div>
  );
}
