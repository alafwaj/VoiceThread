# VoiceThread — Requirements

> **Status:** sections 1 to 6 drafted. Not yet reviewed by the instructor.
> **Owners:** Package 1 writes sections 1 to 3. Package 2 writes sections 4 to 6.

## 1. Product overview

VoiceThread is a web application where people talk to each other by recording short voice messages instead of typing. A user records a post of up to five minutes, and other users answer it with their own recordings. Replies can be answered in turn, so every conversation grows into a tree of voices rather than a flat list of comments. Listeners can follow one branch of the tree without losing track of the others. The application is built for university students and staff and runs locally for the course demonstration.

## 2. Users

| User | What they want from VoiceThread |
|---|---|
| Visitor | To see what the product is and create an account so they can take part. |
| Listener | To find conversations by topic or feed, play them at a comfortable speed, and follow one line of discussion through the tree. |
| Contributor | To record posts and replies easily, follow people whose voices they value, and keep conversations they want to come back to. |

A listener and a contributor are the same registered person. The two names describe what they are doing at that moment.

## 3. User stories

The words "original post", "reply", and "post" are used the way section 5 defines them.

### US-01: Create an account and log in

As a visitor, I want to create an account and log in and out of it, so that I can post and reply and nobody else can use my account.

Acceptance criteria:

- Registering with an unused username, an unused email, and a password of 8 or more characters creates the account.
- If the username or email is already taken, or the password is shorter than 8 characters, the form shows an error that names that field.
- Logging in with correct details takes the user to the Home feed, and the user is still logged in after the page is refreshed.
- Wrong login details show one message that does not say which field was wrong.
- After logging out, opening a page that needs an account sends the user to the login page.

### US-02: Have a profile

As a user, I want a profile page with my name, photo, bio, and recordings, so that other people can tell who is speaking and find more from me.

Acceptance criteria:

- A profile page shows the user's display name, photo, bio, follower and following counts, and their original posts.
- A user can change their own display name, photo, and bio, and the change is still there after a refresh.
- A user is given no way to change someone else's profile, and the server refuses the request if they try.

### US-03: Record a voice post

As a contributor, I want to record my voice in the browser and listen back before sharing, so that I only publish something I am happy with.

Acceptance criteria:

- While recording, the screen shows that recording is on, the elapsed time, and the maximum time.
- Recording stops by itself at 5 minutes.
- After recording, the user can play the recording back, record it again, or cancel, and cancelling saves nothing.
- If microphone access is denied, the screen explains how to allow it.

### US-04: Publish a post with a title and topics

As a contributor, I want to give my recording a title and topics, so that other people can find it.

Acceptance criteria:

- An original post with no title, or with no topic, cannot be published, and the missing field is marked.
- An original post can have 1 to 3 topics, and a fourth cannot be chosen.
- A recording shorter than 30 seconds cannot be published, and the screen says why.
- After publishing, the original post appears on the author's profile and in the Home feed.

### US-05: Delete my own post

As a contributor, I want to delete a post or reply I recorded, so that I can take back something I no longer want heard.

Acceptance criteria:

- A user can delete their own original posts and replies, and no delete control is shown on anyone else's.
- If one user asks the server to delete another user's post, the server refuses and the post is unchanged.
- A deleted post that has replies is replaced by a "post deleted" marker, and its replies stay where they were in the tree.

### US-06: Listen with playback controls

As a listener, I want to play, pause, jump around, and change the speed of a recording, so that I can listen in the way that suits me.

Acceptance criteria:

- Play, pause, and seeking work, and the player shows elapsed time and total time.
- The speeds 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, and 2x can each be selected.
- The chosen speed is still selected after the page is refreshed.

### US-07: Reply with voice

As a contributor, I want to reply with a recording to any original post or any reply, so that my answer is attached to the exact thing I am responding to.

Acceptance criteria:

- A reply can be recorded from an original post and from another reply.
- The new reply appears directly under the post it answers, and that post's reply count goes up by one.
- A reply shorter than 30 seconds or longer than 5 minutes is refused.
- A reply to a post that has been deleted is refused.

### US-08: See a conversation as a tree

As a listener, I want to see a conversation drawn as a tree, so that I can tell who answered whom.

Acceptance criteria:

- In a thread with replies on three levels, each reply is shown under the post it answers.
- Each post in the tree shows the speaker, the length, and the number of direct replies, and the original post also shows its title.
- The tree looks the same after the server is restarted.

### US-09: Collapse, expand, and move along branches

As a listener, I want to collapse and expand branches and move between posts, so that I can stay with one branch of the conversation at a time.

Acceptance criteria:

- Collapsing a branch hides its replies and shows how many were hidden, and expanding it shows them again.
- From a selected post, the user can go to the post it answers and to any of its replies.
- The selected post is marked in a way that does not rely on color alone.

### US-10: Browse topics

As a listener, I want to browse a list of topics and open one, so that I find conversations about things I care about.

Acceptance criteria:

- The topic list shows every topic in the fixed list.
- A topic page lists the original posts with that topic, newest first.
- A topic with no posts shows a message saying it is empty.

### US-11: Follow people and use the Home feed

As a user, I want to follow other users and see their posts first, so that the people I most want to listen to are at the top of my feed.

Acceptance criteria:

- Pressing Follow changes the button to Unfollow and updates both users' follower and following counts, and this is still true after a refresh.
- A user cannot follow themselves.
- The Home feed lists original posts by followed users first and everyone else's after them, newest first within each group.

### US-12: Bookmark a post and share a link to it

As a user, I want to bookmark a post and copy a link to it, so that I can come back to it later or send someone to an exact place in a conversation.

Acceptance criteria:

- The bookmark control switches on and off on any original post or reply, and its state is shown by more than color.
- The Bookmarks page lists only the logged-in user's bookmarks, most recently added first, and another user cannot see, add, or remove them.
- Pressing "Copy link" puts the link on the clipboard and shows a confirmation.
- Opening the link shows the thread with that post highlighted.
- Opening a link to a deleted or missing post shows a clear message instead of a blank or broken page.

## 4. Scope

**In scope**

These are the seven foundation features from the project brief, plus the parts of the advanced list that come almost free once the foundation exists.

- Accounts: register, log in, log out, and a profile page focused on the user's voice posts.
- Recording voice posts of 30 seconds to 5 minutes in the browser, with a listen-back step before publishing.
- Listening with playback controls, including speed from 0.5x to 2x.
- Compressed audio files, using the compressed format the browser already records in, with no separate compression step.
- Replying with voice to any post or reply, so conversations branch into a tree.
- A thread page that shows the tree, with branches that can be collapsed and expanded and each reply showing who spoke and how long it is.
- Topic tags on original posts, a list of the topics, and a page for each topic, so each topic works as its own feed.
- Following users and a Home feed that puts the people you follow first.
- Bookmarking posts and copying a share link to a post.
- Saving everything (accounts, posts, audio, follows, bookmarks) so it survives a refresh or a server restart.
- A web interface that works on desktop and on phone-sized screens, run locally on the demo laptop.

**Only if time allows (Sprint 3)**

These are built only after everything above works and has been tested:

- Search for users, post titles, and topics (not the words spoken in recordings).
- A Discover page that lists recent original posts from people the user does not follow.
- Reporting a post with a written reason, which the team can review by hand.

**Out of scope**

The project brief lists advanced features that would take far more than one semester. The team will not build these:

- Transcription and search of what is said: speech-to-text, transcript search, keyword highlighting, other languages, telling speakers apart.
- Audio processing beyond what the browser already does: noise reduction, volume levelling, detecting duplicate audio, and streaming at scale through a CDN.
- Smart discovery: recommendations, trending, "best paths" through big threads, related threads.
- Moderation beyond a simple report: automatic or machine-learning moderation, automated flagging, reports marked at a timestamp, community moderators.
- Extra engagement: audio reactions, bookmarking a moment inside a recording, sharing a clip of a recording, offline download, podcast export.
- Advanced tree extras: highlighted "interesting paths" and waveform previews on each reply.
- Anything outside the brief: mobile apps, live audio rooms, direct messages, notifications, and online hosting.

## 5. Functional requirements

> User story IDs refer to section 3.

> Terms: an original post starts a thread, a reply answers an original post or another reply, and "post" on its own means either.

| ID | Area | Requirement | User story |
|---|---|---|---|
| FR-01 | Accounts | A visitor can create an account with a username and an email that nobody else has used and a password of at least 8 characters. | US-01 |
| FR-02 | Accounts | A registered user can log in with their username or email and their password, and stays logged in after refreshing the page or reopening the browser until they log out. | US-01 |
| FR-03 | Accounts | A logged-in user can log out, after which pages that need an account send them to the login page. | US-01 |
| FR-04 | Profiles | A profile page shows the user's display name, photo, bio, number of followers and followed users, and their original posts. | US-02 |
| FR-05 | Profiles | A user can change their own display name, photo, and bio, and cannot change anyone else's. | US-02 |
| FR-06 | Recording | The app records audio from the microphone once the user allows it, and explains what to do if permission is refused or no microphone is found. | US-03 |
| FR-07 | Recording | While recording, the screen shows the time recorded so far and the 5-minute limit, recording stops by itself at 5 minutes, and the publish button stays disabled until the recording is at least 30 seconds long. | US-03, US-04 |
| FR-08 | Recording | Before publishing, the user can listen to the recording, record it again, or discard it. | US-03 |
| FR-09 | Recording | Publishing an original post requires a title and 1 to 3 topics with an optional description, while a reply needs neither and belongs to the topics of its original post. | US-04, US-07 |
| FR-10 | Recording | The server refuses any recording, whether an original post or a reply, that is shorter than 30 seconds, longer than 5 minutes, larger than 10 MB, or not WebM, Ogg, or MP4 audio, and the user sees why. | US-04, US-07 |
| FR-11 | Recording | A user can delete their own original posts and replies, and the server refuses a delete request from anyone who is not the author. | US-05 |
| FR-12 | Listening | The player has play and pause, a progress bar the user can drag to any point, and the elapsed and total time. | US-06 |
| FR-13 | Listening | The user can set playback speed to 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, or 2x, and the chosen speed is still selected after the page is refreshed. | US-06 |
| FR-14 | Replies | A user can reply with a voice recording of 30 seconds to 5 minutes to any original post or reply that has not been deleted, and the reply stays linked to the exact post it answers. | US-07 |
| FR-15 | Conversation tree | The thread page shows the original post with every reply placed under the post it answers, at any depth. | US-08 |
| FR-16 | Conversation tree | Each original post and reply in the tree shows who recorded it, how long it is, and how many direct replies it has, and the original post also shows its title. | US-08 |
| FR-17 | Conversation tree | The user can collapse any branch to hide its replies, see how many are hidden, and expand it again. | US-09 |
| FR-18 | Conversation tree | When an original post or reply that has replies is deleted, a "post deleted" marker takes its place, so its replies keep their position in the tree. | US-05, US-08 |
| FR-19 | Topics | Topics come from a fixed list (for example technology, philosophy, and storytelling) shown on a topics page, and each topic has a page listing the original posts tagged with it, newest first. | US-10 |
| FR-20 | Following | A user can follow and unfollow other users, but cannot follow themselves. | US-11 |
| FR-21 | Feed | The Home feed lists original posts, not replies, with those from the users someone follows first and everyone else's after them, newest first within each group. | US-11 |
| FR-22 | Bookmarks | A user can bookmark any original post or reply, remove the bookmark, and see all their bookmarks, most recently added first, on a Bookmarks page that only they can view. | US-12 |
| FR-23 | Sharing | A user can copy a link to any original post or reply, and opening the link shows its thread with that recording highlighted. | US-12 |
| FR-24 | Storage | Accounts, original posts, replies, audio, follows, and bookmarks are still there after the page is refreshed or the server is restarted. | US-01, US-04, US-07, US-11, US-12 |
| FR-25 | Conversation tree | From a selected post in the tree, the user can move to the post it answers and to any of its replies. | US-09 |

## 6. Non-functional requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-01 | Usability | At least 3 testers who have never used the app can record and publish a post in under 3 minutes without help. |
| NFR-02 | Responsive design | Every screen can be used at widths from 360 px (phone) to 1440 px (laptop) without scrolling sideways. |
| NFR-03 | Accessibility | Every button and control, including the audio player, can be used with the keyboard alone and has a text label that a screen reader can announce, and nothing such as the selected post or a bookmark is shown by color alone. |
| NFR-04 | Security | Passwords are stored only as hashes, and the server checks that the user is logged in and owns the data before every change. |
| NFR-05 | Performance | On the demo laptop, a feed page of 20 posts loads in under 2 seconds, and a thread of 100 replies loads in under 3 seconds. |
| NFR-06 | Reliability | No reply is ever saved without a valid parent post, and a failed upload leaves no half-saved post or orphaned audio file. |
| NFR-07 | Compatibility | Every feature works in the current versions of Chrome and Edge on Windows. |
| NFR-08 | Maintainability | A team member who has not seen the project can get it running on their own computer in under 15 minutes by following the README. |
