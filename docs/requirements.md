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

> User story IDs refer to section 3. They are provisional until Package 1 is merged: US-01 account, US-02 profile, US-03 record and publish, US-04 listen, US-05 reply, US-06 conversation tree, US-07 topics, US-08 follow and feed, US-09 bookmark, US-10 share.

| ID | Area | Requirement | User story |
|---|---|---|---|
| FR-01 | Accounts | A visitor can create an account with a username and an email that nobody else has used and a password of at least 8 characters. | US-01 |
| FR-02 | Accounts | A registered user can log in with their username or email and their password. | US-01 |
| FR-03 | Accounts | A logged-in user can log out, after which pages that need an account send them to the login page. | US-01 |
| FR-04 | Profiles | A profile page shows the user's display name, photo, bio, number of followers and followed users, and their voice posts. | US-02 |
| FR-05 | Profiles | A user can change their own display name, photo, and bio, and cannot change anyone else's. | US-02 |
| FR-06 | Recording | The app records audio from the microphone once the user allows it, and explains what to do if permission is refused or no microphone is found. | US-03 |
| FR-07 | Recording | While recording, the screen shows the time recorded so far and the 5-minute limit, and recording stops by itself at 5 minutes. | US-03 |
| FR-08 | Recording | Before publishing, the user can listen to the recording, record it again, or discard it. | US-03 |
| FR-09 | Recording | Publishing a post requires a title and 1 to 3 topics, and a description is optional. | US-03, US-07 |
| FR-10 | Recording | The server refuses recordings shorter than 30 seconds, longer than 5 minutes, or in a file type it does not accept, and the user sees why. | US-03 |
| FR-11 | Recording | A user can delete their own posts, and the server refuses a delete request from anyone who is not the author. | US-03 |
| FR-12 | Listening | The player has play and pause, a progress bar the user can drag to any point, and the elapsed and total time. | US-04 |
| FR-13 | Listening | The user can set playback speed to 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, or 2x. | US-04 |
| FR-14 | Replies | A user can reply with a voice recording to any post or reply, and the reply stays linked to the exact post it answers. | US-05 |
| FR-15 | Conversation tree | The thread page shows the original post with every reply placed under the post it answers, at any depth. | US-06 |
| FR-16 | Conversation tree | Each post in the tree shows who recorded it, how long it is, and how many direct replies it has. | US-06 |
| FR-17 | Conversation tree | The user can collapse any branch to hide its replies, see how many are hidden, and expand it again. | US-06 |
| FR-18 | Conversation tree | When a post that has replies is deleted, a "post deleted" marker takes its place, so its replies keep their position in the tree. | US-03, US-06 |
| FR-19 | Topics | Topics come from a fixed list (for example technology, philosophy, and storytelling), and each topic has a page listing its posts with the newest first. | US-07 |
| FR-20 | Following | A user can follow and unfollow other users, but cannot follow themselves. | US-08 |
| FR-21 | Feed | The Home feed lists posts from the users someone follows, newest first, and shows recent posts from everyone when they follow nobody. | US-08 |
| FR-22 | Bookmarks | A user can bookmark a post, remove the bookmark, and see all their bookmarks on a Bookmarks page that only they can view. | US-09 |
| FR-23 | Sharing | A user can copy a link to any post, and opening the link shows that post's thread with the post highlighted. | US-10 |
| FR-24 | Storage | Accounts, posts, audio, follows, and bookmarks are still there after the page is refreshed or the server is restarted. | US-01, US-03, US-08, US-09 |

## 6. Non-functional requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-01 | Usability | At least 3 testers who have never used the app can record and publish a post in under 3 minutes without help. |
| NFR-02 | Responsive design | Every screen can be used at widths from 360 px (phone) to 1440 px (laptop) without scrolling sideways. |
| NFR-03 | Accessibility | Every button and control, including the audio player, can be used with the keyboard alone and has a text label that a screen reader can announce. |
| NFR-04 | Security | Passwords are stored only as hashes, and the server checks that the user is logged in and owns the data before every change. |
| NFR-05 | Performance | On the demo laptop, a feed page of 20 posts loads in under 2 seconds, and a thread of 100 replies loads in under 3 seconds. |
| NFR-06 | Reliability | No reply is ever saved without a valid parent post, and a failed upload leaves no half-saved post or orphaned audio file. |
| NFR-07 | Compatibility | Every feature works in the current versions of Chrome and Edge on Windows. |
| NFR-08 | Maintainability | A team member who has not seen the project can get it running on their own computer in under 15 minutes by following the README. |

## 7. Open questions

*Package 2. Anything the team is unsure about and needs the instructor (Product Owner) to answer. Leave empty if there is nothing.*

-
