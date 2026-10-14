// Starting point of the API server.
// For now it only answers a health check, so we can see that the
// development environment works. Features are added from Sprint 2.

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Lets the interface (and us) check that the server is running.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`VoiceThread server running on http://localhost:${PORT}`);
});
