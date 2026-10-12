# VoiceThread — Product Backlog

> **Status:** not started.
> **Owner:** Package 5.
> Lines in *italics* are instructions. Delete each one when you have written that section.

## 1. How the backlog is ordered

Items are ordered by what the rest of the app needs first. Storage and accounts come before recording, recording comes before replies, and replies come before the conversation tree, the feed and bookmarks. After that, the features the course grades in Sprint 2 go ahead of anything else, and nothing from the "only if time allows" list starts until all of Sprint 2 works and has been tested.

## 2. Sprint 2 backlog (due November 13, 2026)

*The core features. One row per item, most important first. Each item should come from a user story in `docs/requirements.md`. "Size" is a rough estimate: S, M, or L. "Depends on" names any item that must be finished first.*

| ID | Item | User story | Size | Depends on |
|---|---|---|---|---|
| B-01 | Set up the database and audio folder so accounts, posts, audio, follows, and bookmarks survive a refresh or server restart | US-01, US-04, US-07, US-11, US-12 | M | - |
| B-02 | Desktop wireframes for every screen, matching phone wireframes | US-01 to US-12 | S | Wireframes |
| B-03 | Register, log in and log out, with passwords stored as hashes | US-01 | M | B-01 |
| B-04 | Record in the browser: timer, 5-minute limit, listen back, record again or discard, and help if the microphone is blocked. Audio is saved in the compressed format the browser records in | US-03 | L | B-03 |
| B-05 | Publish an original post with a title and 1 to 3 topics. The server refuses recordings under 30 seconds, over 5 minutes, over 10 MB or in the wrong format | US-04 | M | B-04 |
| B-06 | Audio player with play, pause, seeking, elapsed and total time, and speeds from 0.5x to 2x that are remembered after a refresh | US-06 | M | B-05 |
| B-07 | Reply with voice (30 seconds to 5 minutes) to any original post or reply | US-07 | M | B-05, B-06 |
| B-08 | Thread page that shows the conversation as a tree, with speaker, length and reply count on each post | US-08 | L | B-07 |
| B-09 | Collapse and expand branches, and move to a post's parent or its replies | US-09 | M | B-08 |
| B-10 | Delete my own post or reply, leaving a "post deleted" marker so its replies keep their place | US-05 | M | B-08 |
| B-11 | Profile page with name, photo, bio, follower counts and original posts, which only the owner can edit | US-02 | M | B-03, B-05 |
| B-12 | Topics page and one page per topic, newest posts first | US-10 | S | B-05 |
| B-13 | Follow and unfollow other users (not yourself) | US-11 | S | B-11 |
| B-14 | Home feed with posts from followed users first, then everyone else, newest first in each group | US-11 | M | B-05, B-13 |
| B-15 | Bookmark any post or reply, and a private Bookmarks page | US-12 | M | B-08 |
| B-16 | Copy a link to a post, and open the thread with that post highlighted | US-12 | S | B-08 |
| B-17 | Make every screen work from phone width (360 px) to laptop width (1440 px) in the browser | US-01 to US-12 | M | B-02 |
|  |  |  |  |  |

## 3. Sprint 3 backlog (due December 7, 2026)

*Extra features, testing, documentation, and the presentation. Same columns.*

| ID | Item | User story | Size | Depends on |
|---|---|---|---|---|
| B-18 | Search for users, post titles and topics (not the words spoken in recordings) | US-10 | M | B-11, B-12 |
| B-19 | Discover page: recent original posts only from people the user does not follow, each with a Follow button next to the speaker. Home is for listening to people you already know; Discover is for finding new people to follow | US-11 | S | B-13, B-14 |
| B-20 | Report a post with a written reason, which the team reviews by hand | US-05 | S | B-08 |
| B-21 | Testing: check every acceptance criterion in US-01 to US-12, run a usability test with 3 new users, and check keyboard and screen reader use | US-01 to US-12 | L | B-01 to B-12 |
| B-22 | Fix the problems found in testing | US-01 to US-12 | M | B-21 |
| B-23 | Documentation: a README that lets someone set up and run the app in under 15 minutes, plus a short user guide | US-01 to US-12 | M | B-01 to B-17 |
| B-24 | Final presentation and live demo | US-01 to US-12 | M | B-22, B-23 |

## 4. Not planned

*Features from the project brief that the team has decided not to build, with one line of reason each. This should match the "Out of scope" list in `docs/requirements.md`.*
| FEATURE | Why we are not building it |
| Transcription and search of what is said (speech-to-text, transcript search, keyword highlighting, other languages, telling speakers apart) | Needs speech recognition, which is far too big for one semester. |
| Audio processing beyond what the browser does (noise reduction, volume levelling, duplicate detection, CDN streaming) | The browser's own recording quality is good enough for a local demo, and we have no servers to stream from. |
| Smart discovery (recommendations, trending, "best paths", related threads) |	Needs much more data and users than a class project will have; topics, the feed and Discover cover finding posts. |
| Moderation beyond a simple report (automatic or machine-learning moderation, automated flagging, timestamped reports, community moderators) |	A written report reviewed by the team is enough for a small group of students. |
| Extra engagement (audio reactions, bookmarking a moment, sharing clips, offline download, podcast export)	| Nice to have, but each one is a project of its own and none is needed for the core experience. |
| Advanced tree extras (highlighted "interesting paths", waveform previews on each reply) |	The basic tree with collapse and expand already lets people follow a branch. |

-

## 5. On the board

*When this document is agreed, add each Sprint 2 and Sprint 3 item to the Kanban board as a card (a GitHub issue), with the milestone "Sprint 2" or "Sprint 3". Tick here when done.*

- [ ] Sprint 2 items added to the board
- [ ] Sprint 3 items added to the board
