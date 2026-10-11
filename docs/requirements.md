# VoiceThread — Requirements

> **Status:** sections 4 to 7 drafted. Sections 1 to 3 not started.
> **Owners:** Package 1 writes sections 1 to 3. Package 2 writes sections 4 to 7.
> Lines in *italics* are instructions. Delete each one when you have written that section.

## 1. Product overview

*Package 1. Three to five sentences. What VoiceThread is, who it is for, and what makes it different (a conversation is a tree: every reply answers one specific post).*

## 2. Users

*Package 1. A short table of the kinds of user (for example a listener, a contributor) and what each wants.*

| User | What they want |
|---|---|
| | |

## 3. User stories

*Package 1. Write 10 to 12 user stories for the core features: account, recording a post, listening, replying, viewing the conversation tree, topics, following, bookmarking, sharing.*

*Use this form for every story. Give each an ID and 2 to 3 acceptance criteria: things a tester could check with a yes or no.*

```
US-01
As a [kind of user], I want [action], so that [benefit].
Acceptance criteria:
- ...
- ...
```

## 4. Scope

**In scope**

These are the seven foundation features from the project brief, plus the parts of the advanced list that come almost free once the foundation exists.

- Accounts: register, log in, log out, and a profile page focused on the user's voice posts.
- Recording voice posts of 30 seconds to 5 minutes in the browser, with a listen-back step before publishing.
- Listening with playback controls, including speed from 0.5x to 2x.
- Compressed audio files, using the compressed format the browser already records in, with no separate compression step.
- Replying with voice to any post or reply, so conversations branch into a tree.
- A thread page that shows the tree, with branches that can be collapsed and expanded and each reply showing who spoke and how long it is.
- Topic tags on posts and a page for each topic, so each topic works as its own feed.
- Following users and a Home feed built from the people you follow.
- Bookmarking posts and copying a share link to a post.
- Saving everything (accounts, posts, audio, follows, bookmarks) so it survives a refresh or a server restart.
- A web interface that works on desktop and on phone-sized screens, run locally on the demo laptop.

**Out of scope**

The project brief lists advanced features that would take far more than one semester. The team will not build these:

- Transcription and search of what is said: speech-to-text, transcript search, keyword highlighting, other languages, telling speakers apart.
- Audio processing beyond what the browser already does: noise reduction, volume levelling, detecting duplicate audio, and streaming at scale through a CDN.
- Smart discovery: recommendations, trending, "best paths" through big threads, related threads.
- Moderation: automatic or machine-learning moderation, flagging, timestamped reports, community moderators.
- Extra engagement: audio reactions, bookmarking a moment inside a recording, sharing a clip of a recording, offline download, podcast export.
- Advanced tree extras: highlighted "interesting paths" and waveform previews on each reply.
- Anything outside the brief: mobile apps, live audio rooms, direct messages, notifications, and online hosting.

## 5. Functional requirements

*Package 2. About 20 requirements: things the system must do. Number them FR-01, FR-02, and so on. Group them by area. Each one is a single sentence that can be tested, and each should trace to a user story in section 3.*

| ID | Area | Requirement | User story |
|---|---|---|---|
| FR-01 | | | |

## 6. Non-functional requirements

*Package 2. Six to eight requirements about how well the system works, not what it does: usability, security, performance, accessibility, reliability, maintainability. Number them NFR-01 onward. Make each one checkable.*

| ID | Area | Requirement |
|---|---|---|
| NFR-01 | | |

## 7. Open questions

*Package 2. Anything the team is unsure about and needs the instructor (Product Owner) to answer. Leave empty if there is nothing.*

-
