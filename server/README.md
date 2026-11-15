# server

The backend (the API, business rules, and database access), built with Node.js and Express. It follows the layers in `docs/uml/component.md` and the class names in `docs/uml/class.md`: routes call services, and services call repositories, which are the only code that touches the database or the audio folder.

| Path | What it is |
|---|---|
| `src/index.js` | Starting point: starts the app on port 3001 |
| `src/app.js` | Builds the Express app: the seven route groups, with the auth check in front of every group except `/auth` and `/topics` |
| `src/db.js` | Opens the SQLite database (Node's built-in SQLite) and creates the tables from `design.md` sections 3 and 8 |
| `src/middleware/auth.js` | The auth check: calls `AuthService.checkSession()` |
| `src/routes/` | One file per route group: auth, posts, users, topics, follows, bookmarks, reports |
| `src/services/` | The rules from the requirements, one service per route group |
| `src/repositories/` | One repository per kind of stored data, plus `AudioRepository` for the audio folder |
| `scripts/make-moderator.js` | Gives a user the moderator role (there is no screen for this) |
| `test/api.test.js` | API tests, one per group of requirements. Run with `npm test` |

Known limit: the length of a recording (FR-10) is the length the browser measured while recording. The server checks it is between 30 seconds and 5 minutes, but does not read it from the audio file itself yet (backlog B-05).
