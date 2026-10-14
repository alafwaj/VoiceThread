// Placeholder page. It asks the server for its health check and shows
// the answer, so we can see that the interface and the server are
// connected. The real screens are built from Sprint 2.

import { useEffect, useState } from 'react';

export default function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setServerStatus(data.status === 'ok' ? 'running' : 'not responding'))
      .catch(() => setServerStatus('not responding'));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>VoiceThread</h1>
      <p>Development environment is set up. Features start in Sprint 2.</p>
      <p>Server: {serverStatus}</p>
    </main>
  );
}
