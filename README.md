# VoiceThread

VoiceThread is an audio-first social network. You record a short voice post and people reply with their own voice. Each reply answers one specific post, so a conversation grows into a tree of replies.

This is Project 3 for SWEN 360 / CMPE 460 (Software Design and Engineering) at the American University of Bahrain, Fall 2026.

We are at the end of Sprint 1: requirements, the first design, and getting used to working as an agile team. Assignment 1 was submitted on October 13, 2026, and Course Phase 1 is due October 16, 2026. The development environment is set up, but the app has no features yet. They start in Sprint 2.

## Team

| Member | Sprint 1 work |
|---|---|
| Amin | Team leader, reviewer, and Scrum Master for Sprint 1 (runs the meetings and keeps the process records) |
| Yousif | Package 1: user stories |
| Omar | Package 2: functional and non-functional requirements |
| Yagoob | Package 3: architecture and initial design |
| Rayyan | Package 4: wireframes |
| Layla | Package 5: product backlog and sprint plan |

The course instructor is the Product Owner. The Scrum Master changes every sprint.

## Getting started

1. Accept the GitHub invitation to this repo (check your email or https://github.com/notifications).
2. Clone it and set your Git name and email. The commands are in [CONTRIBUTING.md](CONTRIBUTING.md).
3. Open the board and find the card with your name on it.
4. Read the card. It says what to write, which file it goes in, and when it counts as done.

## Running the app

You need Node.js 22.12 or newer. Check with `node -v`. If it is missing or older, install the LTS version from https://nodejs.org.

In the repo folder, install the packages once (and again whenever `package.json` changes):

```bash
npm install
```

Then start the server and the interface together:

```bash
npm run dev
```

Open http://localhost:5173 in Chrome. The page should say "Server: running". If it says "not responding", look at the terminal for a `[server]` error. Press Ctrl+C in the terminal to stop both.

The server runs on port 3001 and the interface on port 5173. The interface passes every `/api` request on to the server, so in the browser you only use port 5173.

## The board

All our tasks are cards on the Kanban board: https://github.com/users/alafwaj/projects/2

If it opens as a list, click the small arrow next to the view name and choose Board under Layout.

Move your card to In progress when you start and to In review when you open a pull request. It moves to Done when the pull request is merged. If a card has no owner and you want it, open it, click Assignees on the right, and choose yourself.

Besides the five package cards there are "Everyone" cards that all six of us do (tick your own name when your part is done) and process cards for the Scrum Master.

## What's in the repo

| Path | What it is |
|---|---|
| `CONTRIBUTING.md` | Git steps: clone, branch, commit, pull request |
| `docs/requirements.md` | User stories (Package 1), then functional and non-functional requirements (Package 2) |
| `docs/design.md` | Technology choice, architecture diagram, database tables, and how the reply tree is stored (Package 3) |
| `docs/wireframes/` | Wireframes of the main screens, exported from Figma (Package 4) |
| `docs/backlog.md` | Features for Sprints 2 and 3 in priority order (Package 5) |
| `docs/process/` | Sprint planning minutes, stand-up log, retrospective, impediment log |
| `docs/process/kanban/` | Board screenshots from the beginning, middle, and end of the sprint |
| `package.json` | Lists the two halves of the app and the `npm run dev` command that starts both |
| `client/` | The interface: React, set up with Vite. For now one placeholder page |
| `server/` | The API server: Node.js with Express. For now one health check route |
| `shared/` | Code both sides use, such as recording length limits. Empty until Sprint 2 |

The files in `docs/` already have their headings, with a short note under each one saying what goes there.

## How we work

Nobody commits straight to `main`. You work on your own branch, commit in small steps over several days, and open a pull request when a part is ready. Amin reviews pull requests at the end of the day, and one other teammate reads it and leaves a comment. If something needs fixing, fix it on the same branch and push again. Once it's approved it gets merged and your card moves to Done.

The review checks four things:

- it's your own work, in your own words
- it covers every heading on your card
- it agrees with the other documents (same feature names, same numbers)
- another member could explain it after reading it

## The reference repo and AI tools

There is an older version of this project, drafted with AI, in a separate private repo called `VoiceThread-Reference`. Read it to understand the project or to check your work, but don't copy files or paragraphs from it. Write your own version. It can be much shorter.

The course allows AI tools. Use them to explain things, check your draft, or suggest improvements. You have to be able to explain everything you commit.

## Sprints

| Sprint | Ends | Goal |
|---|---|---|
| 1 | October 16, 2026 | Requirements, initial design, repository, agile process (Assignment 1) |
| 2 | November 13, 2026 | Core features working |
| 3 | December 7, 2026 | Extra features, testing, documentation, presentation |

Each sprint needs a planning meeting, at least two stand-ups a week (eight or more in total), and a retrospective. All of them get written up in `docs/process/`.

## Tech we use

React (set up with Vite) for the interface, Node.js with Express for the server, and SQLite for the database, all running locally. The reasons are in section 1 of `docs/design.md`. The interface and the server are set up. SQLite and the audio folder are added with backlog item B-01 in Sprint 2.
