# Stand-up Log

One entry per stand-up meeting, written the same day by the member running the meeting. A stand-up is about 15 minutes: each person says what they did, what they will do next, and what is blocking them.

The course requires at least two stand-ups a week and at least eight documented stand-ups per sprint.

Rules:

- Write an entry only for a meeting that took place.
- Use real names and the real date.
- Newest entry at the top of "Entries".
- A blocker stays listed until an entry says it is resolved. Copy real blockers into `impediment-log.md`.
- If you have proof of the meeting (a photo or a call screenshot), save it in `docs/process/proof/` and name the file in the entry.

## Template (copy this for each meeting)

```markdown
### YYYY-MM-DD — Sprint 1, stand-up N

**Run by:**
**Present:**
**Absent:**
**Proof:** (file name, or "none")

| Member | Done since last stand-up | Doing next | Blocked by |
|---|---|---|---|
| Name | | | |
| Name | | | |

**Decisions:**
-

**Actions (who, what, by when):**
-
```

## Entries

### 2026-10-12 — Sprint 1, stand-up 8

**Run by:** Amin Fares
**Present:** Amin, Rayyan, Layla, Omar, Yagoob, Yousif
**Absent:** None
**Proof:** none

This meeting was a working session on a Discord call from about 9 pm to 11 pm, so it was longer than a normal stand-up. Members worked on their packages during the call. It was written up on October 13, 2026, shortly after midnight.

| Member | Done since last stand-up | Doing next | Blocked by |
|---|---|---|---|
| Yousif | Package 1 (product overview, users and 12 user stories) was merged through pull request #23. Reviewed the design in #25. | Not recorded at the meeting | None raised |
| Omar | Package 2 (scope, 25 functional and 8 non-functional requirements, open questions) was merged through #20. | Not recorded at the meeting | None raised |
| Yagoob | Package 3: first notes were merged as #21 and #22 without a review, then reworked into `docs/design.md` and merged through #25 during the call. | Not recorded at the meeting | None raised |
| Layla | Package 5: the backlog with the Sprint 2 and Sprint 3 items was merged through #26 during the call. | Not recorded at the meeting | None raised |
| Rayyan | Package 4: drew the phone wireframes in Figma. They were not pushed by the end of the call. Reviewed the backlog in #26. | Not recorded at the meeting | None raised |
| Amin | Reviewed and merged #20, #23, #25 and #26, corrected the status line of the requirements (#24), took the middle-of-sprint board screenshot, and kept the board up to date. | Not recorded at the meeting | None raised |

**Decisions:**
- Before the call, the Scrum Master and the owners of Packages 1 and 2 settled two points so the two halves of the requirements agree: original posts and replies are both 30 seconds to 5 minutes, and the Home feed lists followed users first. Both are recorded in `docs/requirements.md`.
- Assignment 1 is now due on October 13, 2026, after a one-day extension.
- After the call, the same night, the Scrum Master proposed React for the interface in place of plain HTML and JavaScript pages, and all members agreed. This is recorded in `docs/design.md` through pull request #52.

**Actions (who, what, by when):**
- None recorded at the meeting.

**After the call, the same night:**
- The 24 backlog items were added to the board as cards with the Sprint 2 and Sprint 3 milestones (#27 to #50), and the backlog was updated through #51.
- The wireframes for Package 4 were committed and merged through #53.
- Omar reviewed #26, Layla reviewed #52 and Yagoob reviewed #53, so every member has now reviewed a teammate's pull request.
- On October 13 the Scrum Master removed the card for the individual submission sections (#8) from the board. The individual reports are tracked with the submission document.

### 2026-10-11 — Sprint 1, stand-up 7

**Run by:** Amin Fares
**Present:** Amin, Rayyan, Layla, Omar, Yagoob, Yousif
**Absent:** None
**Proof:** none

| Member | Done since last stand-up | Doing next | Blocked by |
|---|---|---|---|
| Rayyan, Layla, Omar, Yagoob, Yousif | Created GitHub accounts and got familiar with the repository and tools, partly through tutorial videos. Worked locally; nothing pushed yet. | Commit and push their package work on October 11 and 12. | None raised |
| Amin | Set up the team repository, the Kanban board, and the document and process templates. | Not recorded at the meeting | None raised |

**Decisions:**
- Rayyan owns Package 4 (wireframes).
- After the stand-up, on the same day, the Scrum Master assigned the other packages: Yagoob, Package 3 (architecture and initial design); Omar, Package 2 (requirements); Layla, Package 5 (backlog and sprint plan); Yousif, Package 1 (user stories).
- Amin, as Scrum Master, owns the seven process cards.

**Actions (who, what, by when):**
- All members: push their package work to their own branch, by October 12.

## Meetings held before this log started

If the team met before it began keeping this log, record those meetings here once. Write them from what the members who attended remember, and say so. Use the real dates. Where a detail cannot be recalled, write "not recalled".

Written on: October 11, 2026
Written by: Amin Fares (Scrum Master), from memory
Confirmed by: the other members, on October 12, 2026

Each meeting lasted 15 to 30 minutes.

| # | Date held | Present | Absent | What was discussed and decided |
|---|---|---|---|---|
| 1 | Sunday, September 27, 2026 | Amin, Rayyan, Layla, Omar, Yagoob | Yousif (had not yet joined the team) | See the summary below |
| 2 | Tuesday, September 29, 2026 | Amin, Rayyan, Layla, Omar, Yagoob | Yousif (had not yet joined the team) | See the summary below |
| 3 | Thursday, October 1, 2026 | Amin, Rayyan, Layla, Omar, Yagoob | Yousif (had not yet joined the team) | See the summary below |
| 4 | Sunday, October 4, 2026 | Amin, Rayyan, Layla, Omar, Yagoob | Yousif (had not yet joined the team) | See the summary below |
| 5 | Tuesday, October 6, 2026 | Amin, Rayyan, Layla, Omar, Yagoob, Yousif | None | Yousif's first meeting. By the end of this meeting the team had agreed what each member would work on. |
| 6 | Thursday, October 8, 2026 | Amin, Rayyan, Layla, Omar, Yagoob, Yousif | None | The team discussed getting ready to start the project work. |

The team did not record which topic was covered on which day, so the content of these meetings is summarised together.

- Meetings 1 to 6 were mainly about the team getting to understand the tools it will use, such as GitHub and Figma.
- Across meetings 1 to 5 the team also discussed the project and what each member would work on. This was settled by meeting 5.
- Between meetings, members created their GitHub accounts and got familiar with the tools, partly by watching tutorial videos.
- Members worked locally in this period and pushed nothing to the repository. The work was not yet organised into the five packages on the board, so members did not know their work by package. The Scrum Master assigned the package owners on October 11 (see stand-up 7).
- Which topic was covered on which day: not recalled.
- Blockers raised: none. Quizzes and assignments in other courses slowed the team down in this period (see `impediment-log.md`).
