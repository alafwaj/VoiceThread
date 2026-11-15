// Small helper for talking to the API server. Every call returns the JSON
// body, or throws an Error with the server's message so pages can show it.
export async function api(method, path, body) {
  const opts = { method, credentials: 'same-origin', headers: {} };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) {
    opts.body = JSON.stringify(body);
    opts.headers['Content-Type'] = 'application/json';
  }
  let res;
  try {
    res = await fetch(`/api${path}`, opts);
  } catch {
    throw new Error('Cannot reach the server. Check that it is running.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status}).`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const photoUrl = (photo) => (photo ? `/api/photos/${photo}` : null);
export const audioUrl = (postId) => `/api/posts/${postId}/audio`;

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function timeAgo(sqlDate) {
  const then = new Date(`${sqlDate.replace(' ', 'T')}Z`);
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return then.toLocaleDateString();
}

// Dates as in the design: 13/11/2026.
export function shortDate(sqlDate) {
  const d = new Date(`${sqlDate.replace(' ', 'T')}Z`);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
