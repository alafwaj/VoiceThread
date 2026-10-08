# VoiceThread

An audio-first social network. Users record short voice posts and reply with voice. Every reply answers one specific post, so a conversation is a tree, not a flat list of comments.

Project 3 for SWEN 360 / CMPE 460 Software Design and Engineering, American University of Bahrain, Fall 2026.

**Current sprint:** Sprint 1, Assignment 1 (due October 16, 2026). This sprint is requirements, initial design, and working as an agile team. No application code is written yet.

---

## Start here

If you are new to this repository, do these five things in order.

1. **Accept the GitHub invitation** to this repository (check your email or https://github.com/notifications).
2. **Clone it and set your Git identity.** The exact commands are in [CONTRIBUTING.md](CONTRIBUTING.md).
3. **Open the board** (link below) and read the cards in the "To do" column.
4. **Assign yourself one package card** (Package 1 to 5). One member per package.
5. **Open your card and read it.** It tells you what to write, which file to write it in, and what "done" means.

## Where to find your task

All tasks are cards on the team's Kanban board:

**Board:** (link added when the board is created)

- **To pick a task:** open a card, click **Assignees** on the right, and choose yourself.
- **When you start:** drag your card to **In progress**.
- **When you open a pull request:** drag it to **In review**.
- **When your pull request is merged:** it moves to **Done**.

There are three kinds of card:

| Kind | Who does it |
|---|---|
| Package 1 to 5 | One member each. This is your main piece of work |
| "Everyone" cards | All six members. Tick your own name when you have done your part |
| Process cards | The member running the meetings and records |

## Repository map

| Path | What it is | Who writes it |
|---|---|---|
| `README.md` | This page | Team leader |
| `CONTRIBUTING.md` | Step-by-step Git commands: clone, branch, commit, pull request | Already written |
| `docs/requirements.md` | User stories, then functional and non-functional requirements | Package 1 (user stories), Package 2 (requirements) |
| `docs/design.md` | Technology choice, architecture diagram, database tables, how the reply tree is stored | Package 3 |
| `docs/wireframes/` | Wireframe images of the main screens, exported from Figma | Package 4 |
| `docs/backlog.md` | Features for Sprints 2 and 3, in priority order | Package 5 |
| `docs/process/` | Sprint planning minutes, stand-up log, retrospective, impediment log | The member running the meetings |
| `docs/process/kanban/` | Board screenshots from the beginning, middle, and end of the sprint | The member running the meetings |
| `client/` | Frontend code. Empty until Sprint 2 | — |
| `server/` | Backend code. Empty until Sprint 2 | — |
| `shared/` | Code used by both sides. Empty until Sprint 2 | — |

Each document in `docs/` already has its headings and a short note under each one saying what belongs there. You fill in the content.

## How your work gets reviewed

1. You work on your own **branch**, never directly on `main`.
2. You commit in small steps over several days, not everything at once.
3. You open a **pull request** and move your card to "In review".
4. The team leader (Amin) reviews it at the end of the day. One teammate also reads it and leaves a comment.
5. If changes are requested, you fix them on the same branch and push again.
6. When it is approved, it is merged into `main` and your card moves to "Done".

What the review checks:

- It is your own work, in your own words.
- It covers every heading your card lists.
- It agrees with the other documents (same feature names, same numbers).
- It is clear enough that another member could explain it.

## Using the reference and AI tools

An earlier, AI-drafted version of this project is kept in a separate private repository, `VoiceThread-Reference`. Use it to understand the project and to check your work. **Do not copy files or paragraphs from it.** Write your own version; it can be much shorter.

The course allows AI tools. Use them to explain things, to check your draft, and to suggest improvements. You must be able to explain everything you commit.

## Team

Amin (team leader), Rayyan, Layla, Omar, Yagoob, Yousif.

| Role | Who |
|---|---|
| Team leader and reviewer | Amin |
| Scrum Master, Sprint 1 (runs meetings, keeps the process records) | (name to be added) |
| Product Owner | Course instructor |

The Scrum Master role rotates each sprint.

## Sprints

| Sprint | Ends | Goal |
|---|---|---|
| 1 | October 16, 2026 | Requirements, initial design, repository, agile process (Assignment 1) |
| 2 | November 13, 2026 | Core features working |
| 3 | December 7, 2026 | Extra features, testing, documentation, presentation |

Every sprint needs a planning meeting, at least two stand-ups a week (at least eight in total), and a retrospective, all written down in `docs/process/`.

## Planned technology

Proposed in the reference: React for the interface, Node.js with Express for the server, and SQLite for the database, running locally. The owner of Package 3 confirms or changes this in `docs/design.md` and gives the reasons.
