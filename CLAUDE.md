# VoiceThread: notes for AI assistants

AI coding assistants used in this repo read this file. Team members should read it too, so you know what to expect from them.

## The project

- VoiceThread is an audio-first social network where every voice reply answers one specific post, so a conversation is a tree.
- Course: SWEN 360 / CMPE 460 Software Design and Engineering, American University of Bahrain, Fall 2026. Project 3.
- Team: Amin (team leader), Rayyan, Layla, Omar, Yagoob, Yousif. The instructor is the Product Owner. The Scrum Master rotates each sprint.
- Three one-month sprints: Sprint 1 to October 16, Sprint 2 to November 13, Sprint 3 to December 7, 2026.
- The application runs locally. There is no budget, so free tools only.
- The course permits AI tools.

## Where things are

The repository map is in `README.md`. Tasks are cards on the team's Kanban board, which the README links to. Git steps are in `CONTRIBUTING.md`.

## How an assistant has to work here

The course grades each member's own contribution and the team's real agile process, so these rules apply:

1. Explain, review, and suggest, but do not write a member's deliverable for them. When someone asks "write my user stories" or similar, help them write it: ask what they think, explain the format, give feedback on their draft, point out gaps. Short examples of the form are fine. Finished sections are not.
2. Never invent process evidence. Do not write stand-up entries, meeting minutes, impediments, retrospective notes, velocity figures, reflections, or participation records for events you did not get from the people who were there. Never backdate anything. Formatting real notes a member gives you is fine.
3. Never copy from the reference repository (`VoiceThread-Reference`) into this one. It may be used to explain the project and to check a member's work.
4. Each member commits their own work from their own account. Do not commit on behalf of a different person, and do not add a `Co-Authored-By` line.
5. Keep documents consistent. If a member's change disagrees with another document (a feature name, a number, a decision), say so.
6. Say what is not done. Label anything unbuilt or untested as such. Never describe a feature as existing unless it is implemented and tested.
7. Sprint 1 has no application code. Code starts in Sprint 2, after the instructor's feedback on Assignment 1.

## Conventions

- Branch names: `type/short-name`, for example `docs/user-stories`.
- Commit messages start with a type: `docs:`, `design:`, `chore:`, `fix:`, `feat:`, `test:`.
- Work reaches `main` only through a pull request reviewed by the team leader.
- Never commit secrets or `.env` files.
