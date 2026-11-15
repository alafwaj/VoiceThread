# client

The frontend (the part that runs in the browser), built with React and Vite. The screens follow the Phase 1 wireframes in `docs/wireframes/`.

| Path | What it is |
|---|---|
| `index.html` | The single HTML page the app runs in |
| `src/main.jsx` | Starting point: puts the `App` component on the page |
| `src/App.jsx` | Checks who is logged in, picks the page for the address, and shows the bottom bar |
| `src/router.js` | A small hash router, so links like `#/thread/12` can be shared (FR-23) |
| `src/api.js` | Helper for calling the API server |
| `src/pages/` | Welcome, log in and sign up, Home feed, Conversation (thread), Record, Profile, Topics, Bookmarks, and Reports for moderators |
| `src/components/` | Parts used on many pages: the post card, the audio player, the report form |
| `src/styles.css` | All the styles. The colours are variables at the top |
| `vite.config.js` | Vite settings, including passing `/api` requests on to the server |

Start it from the repo root with `npm run dev` (see the main README).
