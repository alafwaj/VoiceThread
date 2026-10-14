import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Requests to /api go to the Express server, so the browser only
    // ever talks to one address during development.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
