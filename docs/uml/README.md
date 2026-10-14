# UML diagrams

UML diagrams of VoiceThread for Course Phase 1. They are written in Mermaid, so GitHub draws them when you open each file. Every diagram is built from `docs/requirements.md` and `docs/design.md` and uses the same names, numbers and IDs.

These diagrams describe the planned design. Nothing in them is built yet. They are updated in Sprint 3 to match the code that is actually written.

| Diagram | File | What it shows | Covers |
|---|---|---|---|
| Use case | [use-case.md](use-case.md) | Who uses the app and what they can do | US-01 to US-12 |
| Class | [class.md](class.md) | The six kinds of stored data and how they link, including the conversation tree | Design sections 3 and 4 |
| Sequence: publish an original post | [sequence-create-post.md](sequence-create-post.md) | Recording, the checks, and saving the audio and the post | US-03, US-04, FR-06 to FR-10 |
| Sequence: reply with voice | [sequence-reply.md](sequence-reply.md) | How a reply is checked and linked to the post it answers | US-07, FR-09, FR-10, FR-14 |
| Sequence: load a thread | [sequence-load-thread.md](sequence-load-thread.md) | How a whole conversation is loaded, built into a tree, and played | US-08, FR-15, FR-16, FR-18, FR-23 |

The architecture diagram is in section 2 of `docs/design.md`. The sequence diagrams use its four parts: the web interface, the API server, the SQLite database and the audio folder.

## Planned for later

These are added in Sprint 3 with the final documentation:

- Sequence diagrams for registering, logging in, following a user, bookmarking a post, and the Sprint 3 extras (search and reporting a post) if they are built.
- Activity diagrams for publishing a post, replying, and exploring a conversation.

## Points to settle in Sprint 2

Drawing the diagrams showed a few places where the documents disagree or leave something open. The diagrams follow the requirements where the two disagree.

1. Logging in: section 3 of the design says the email is used to log in, while FR-02 says the username or the email. The diagrams follow FR-02.
2. Building the tree: design section 4 says "the app" groups the posts into a tree without saying which part. The thread diagram puts this on the server.
3. Length of a recording: FR-10 says the server refuses recordings under 30 seconds or over 5 minutes, but nothing says yet how the server measures the length. This belongs to backlog item B-05.
4. Opening a thread without an account: the requirements do not say whether someone who is not logged in can view a thread, for example from a shared link.
5. API addresses: the sequence diagrams describe each request in plain words because the API addresses are not designed yet.
