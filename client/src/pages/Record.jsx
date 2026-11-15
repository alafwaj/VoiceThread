// Recording an original post or a reply (FR-06 to FR-10, FR-14), as in
// wireframe 04. Shows a clear recording indicator and asks for confirmation
// before publishing (Rayyan's ethical points for this screen).
import { useEffect, useRef, useState } from 'react';
import { api, formatTime } from '../api.js';
import { go } from '../router.js';
import { BackIcon, MicIcon } from '../components/Icons.jsx';

const MIN = 30;
const MAX = 300;
const TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4'];

function pickType() {
  if (typeof MediaRecorder === 'undefined') return null;
  return TYPES.find((t) => MediaRecorder.isTypeSupported?.(t)) ?? '';
}

function micMessage(err) {
  if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') {
    return 'The microphone is blocked. Click the lock or camera icon in the address bar, allow the microphone for this site, then try again.';
  }
  if (err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError') {
    return 'No microphone was found. Plug one in or check your sound settings, then try again.';
  }
  if (err?.name === 'NotReadableError') return 'Another app is using the microphone. Close it and try again.';
  return 'Recording is not available in this browser. Use the latest Chrome or Edge.';
}

export default function Record({ replyToId }) {
  const isReply = Boolean(replyToId);
  const [parent, setParent] = useState(null);
  const [topics, setTopics] = useState([]);
  const [state, setState] = useState('idle'); // idle | recording | done
  const [elapsed, setElapsed] = useState(0);
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState('');
  const [micError, setMicError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', topicIds: [] });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const rec = useRef({});

  useEffect(() => {
    if (isReply) {
      api('GET', `/posts/${replyToId}/thread`)
        .then(({ tree }) => {
          const find = (n) => (n.post.id === replyToId ? n.post : n.children.map(find).find(Boolean));
          setParent(find(tree));
        })
        .catch((err) => setError(err.message));
    } else {
      api('GET', '/topics').then(({ topics: t }) => setTopics(t)).catch((err) => setError(err.message));
    }
  }, [isReply, replyToId]);

  // Stop the microphone if the user leaves the page while recording.
  useEffect(() => () => stopTracks(), []);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  function stopTracks() {
    clearInterval(rec.current.timer);
    rec.current.stream?.getTracks().forEach((t) => t.stop());
  }

  async function start() {
    setMicError('');
    setError('');
    const type = pickType();
    if (type === null || !navigator.mediaDevices?.getUserMedia) return setMicError(micMessage());
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      return setMicError(micMessage(err));
    }
    const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      stopTracks();
      const seconds = Math.min(MAX, (Date.now() - rec.current.startedAt) / 1000);
      const b = new Blob(chunks, { type: recorder.mimeType || type || 'audio/webm' });
      setElapsed(seconds);
      setBlob(b);
      setUrl(URL.createObjectURL(b));
      setState('done');
    };
    rec.current = { recorder, stream, startedAt: Date.now() };
    rec.current.timer = setInterval(() => {
      const s = (Date.now() - rec.current.startedAt) / 1000;
      setElapsed(s);
      // FR-07: recording stops by itself at 5 minutes.
      if (s >= MAX && recorder.state === 'recording') recorder.stop();
    }, 200);
    recorder.start(1000);
    setElapsed(0);
    setBlob(null);
    setState('recording');
  }

  function stop() {
    if (rec.current.recorder?.state === 'recording') rec.current.recorder.stop();
  }

  function discard() {
    setBlob(null);
    setUrl('');
    setElapsed(0);
    setState('idle');
    setConfirming(false);
  }

  function toggleTopic(id) {
    const has = form.topicIds.includes(id);
    if (!has && form.topicIds.length >= 3) return;
    setForm({ ...form, topicIds: has ? form.topicIds.filter((t) => t !== id) : [...form.topicIds, id] });
  }

  const tooShort = elapsed < MIN;
  const formOk = isReply || (form.title.trim() && form.topicIds.length >= 1);
  const canPublish = state === 'done' && blob && !tooShort && formOk;

  async function publish() {
    setBusy(true);
    setError('');
    const data = new FormData();
    const ext = blob.type.includes('ogg') ? 'ogg' : blob.type.includes('mp4') ? 'm4a' : 'webm';
    data.append('audio', blob, `recording.${ext}`);
    data.append('durationSeconds', String(Math.round(elapsed)));
    try {
      if (isReply) {
        const { post } = await api('POST', `/posts/${replyToId}/replies`, data);
        go(`/thread/${post.id}`);
      } else {
        data.append('title', form.title);
        data.append('description', form.description);
        form.topicIds.forEach((t) => data.append('topicIds', String(t)));
        const { post } = await api('POST', '/posts', data);
        go(`/thread/${post.id}`);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
      setConfirming(false);
    }
  }

  const pct = Math.min(100, (elapsed / MAX) * 100);

  return (
    <section>
      <div className="page-bar">
        <button type="button" className="icon-btn" onClick={() => window.history.back()} aria-label="Go back"><BackIcon /></button>
        <h1 className="page-title">{isReply ? 'Record a reply' : 'New voice post'}</h1>
      </div>

      {isReply && parent && (
        <p className="replying-to">
          Replying to {parent.isDeleted ? 'a deleted post' : <strong>{parent.author.displayName}</strong>}
          {parent.title ? <>: “{parent.title}”</> : ''}
        </p>
      )}

      <div className={`recorder recorder-${state}`}>
        {state === 'recording' && (
          <p className="rec-indicator" role="status">
            <span className="rec-dot" aria-hidden="true" /> Recording — your microphone is on
          </p>
        )}
        <p className="rec-time" aria-live="off">
          {formatTime(elapsed)} <span className="muted">/ {formatTime(MAX)}</span>
        </p>
        <div className="rec-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
        <p className="small muted">
          {state === 'recording' && tooShort && `Keep going: at least ${MIN} seconds (${Math.ceil(MIN - elapsed)} s to go).`}
          {state === 'recording' && !tooShort && 'Stops by itself at 5 minutes.'}
          {state === 'idle' && 'Recordings are 30 seconds to 5 minutes long.'}
          {state === 'done' && tooShort && 'This recording is shorter than 30 seconds. Record again to publish.'}
          {state === 'done' && !tooShort && 'Listen back, then publish, record again or discard.'}
        </p>

        {state === 'idle' && (
          <button type="button" className="rec-btn" onClick={start} aria-label="Start recording"><MicIcon /></button>
        )}
        {state === 'recording' && (
          <button type="button" className="rec-btn rec-btn-stop" onClick={stop} aria-label="Stop recording"><span /></button>
        )}
        {state === 'done' && (
          <div className="stack">
            <audio controls src={url} aria-label="Listen back to your recording" className="listen-back" />
            <div className="row">
              <button type="button" className="btn btn-outline" onClick={start}>Record again</button>
              <button type="button" className="btn btn-ghost" onClick={discard}>Discard</button>
            </div>
          </div>
        )}
        {micError && <p className="error" role="alert">{micError}</p>}
      </div>

      {!isReply && (
        <div className="stack">
          <label className="field">
            <span>Title</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={100} required />
          </label>
          <label className="field">
            <span>Description (optional)</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} />
          </label>
          <fieldset className="field">
            <legend>Topics (choose 1 to 3)</legend>
            <div className="chips">
              {topics.map((t) => {
                const on = form.topicIds.includes(t.id);
                return (
                  <button key={t.id} type="button" className={`chip chip-toggle${on ? ' chip-on' : ''}`} aria-pressed={on}
                    onClick={() => toggleTopic(t.id)} disabled={!on && form.topicIds.length >= 3}>
                    {on ? '✓ ' : ''}{t.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" className="btn btn-primary btn-block" disabled={!canPublish || busy} onClick={() => setConfirming(true)}>
        {isReply ? 'Publish reply' : 'Publish post'}
      </button>
      {!canPublish && state === 'done' && !tooShort && !formOk && <p className="small muted center">Add a title and at least one topic to publish.</p>}

      {confirming && (
        <div className="dialog-backdrop" onClick={() => !busy && setConfirming(false)}>
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="confirm-title">Publish this recording?</h2>
            <p className="muted">
              Everyone on VoiceThread will be able to hear it ({formatTime(elapsed)}). You can delete it later from the post.
            </p>
            <div className="row-end">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)} disabled={busy}>Not yet</button>
              <button type="button" className="btn btn-primary" onClick={publish} disabled={busy} autoFocus>
                {busy ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
