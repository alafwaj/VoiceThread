// Starting point of the API server.
import { createApp } from './app.js';

const PORT = process.env.PORT || 3001;

createApp().listen(PORT, () => {
  console.log(`VoiceThread server running on http://localhost:${PORT}`);
});
