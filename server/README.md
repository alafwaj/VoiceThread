# server

The backend (the API, business rules, and database access), built with Node.js and Express.

| Path | What it is |
|---|---|
| `src/index.js` | Starting point: creates the Express app and starts it on port 3001 |

For now the only route is `GET /api/health`, which answers `{"status":"ok"}`. The database and the feature routes are added from Sprint 2.

Start it from the repo root with `npm run dev` (see the main README). The server restarts by itself when a file in `src/` changes.
