# Sequence diagram: reply with voice

This diagram shows what happens when a user answers a post with a voice reply. The post being answered can be an original post or another reply. It covers US-07 and requirements FR-09, FR-10 and FR-14, and shows how a reply is linked into the conversation tree (section 4 of `docs/design.md`).

The server flow is split into the auth middleware, Posts route (controller), `PostService`, the parent `Post` object, `PostRepository` and `AudioRepository`. The middleware authenticates the request before it reaches the route. Every class and method name below is the one in `class.md`, and the route is the one in `component.md`.

The recording steps are the same as for an original post (see `sequence-create-post.md`), so they are shortened to one note here.

This is the planned design. Nothing in it is built yet.

![Sequence diagram: reply with voice](sequence-reply.png)

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Web Interface<br/>(Recorder page)
    participant AC as Auth check<br/>(middleware)
    participant PR as Posts route<br/>(controller)
    participant PS as PostService
    participant Parent as Post<br/>(parent object)
    participant Repo as PostRepository<br/>(SQLite)
    participant AR as AudioRepository<br/>(audio folder)

    U->>UI: Press Reply on a post in the thread
    Note over U,UI: Record, listen back, record again or discard,<br/>as for an original post (FR-06 to FR-08).<br/>A reply has no title or topics (FR-09).
    U->>UI: Press Publish
    UI->>AC: POST /posts/:id/replies<br/>(recording, parent post id)
    AC->>AC: checkSession(sessionId)
    alt Not logged in
        AC-->>UI: Refuse: login needed (FR-03, NFR-04)
        UI-->>U: Redirect to login page
    else Logged in
        AC->>PR: Continue request with authenticated user
        PR->>PS: reply(parentId, authorId, audio)
        PS->>Repo: findById(parentId)
        Repo-->>PS: Parent Post, or nothing
        alt Parent not found or is_deleted = true
            PS-->>PR: Refuse: parent cannot be answered (FR-14)
            PR-->>UI: Refusal reason
            UI-->>U: Show that the post is no longer available
        else Parent exists and is not deleted
            PS->>PS: checkRecording(audio):<br/>30 seconds to 5 minutes, up to 10 MB,<br/>WebM, Ogg or MP4 (FR-10)
            alt Recording check fails
                PS-->>PR: Refuse with validation reason
                PR-->>UI: Refusal reason
                UI-->>U: Show why the reply was refused
            else Recording check passes
                PS->>AR: saveFile(audio)
                alt Audio file save fails
                    AR-->>PS: File write error
                    PS-->>PR: Report that reply could not be saved
                    PR-->>UI: Save failure
                    UI-->>U: Show that the reply failed
                else Audio file saved
                    AR-->>PS: fileName
                    PS->>Parent: reply(audio, authorId)
                    Note right of Parent: Creates the new Post.<br/>parent_post_id = parent.id<br/>root_post_id = parent.root_post_id<br/>(an original post stores its own id there)
                    Parent-->>PS: New Post object
                    PS->>Repo: save(post)
                    alt Database save fails
                        Repo-->>PS: Database error
                        PS->>AR: deleteFile(fileName)<br/>(cleanup, NFR-06)
                        AR-->>PS: File deleted
                        PS-->>PR: Report that reply could not be saved
                        PR-->>UI: Save failure
                        UI-->>U: Show that the reply failed
                    else Database save succeeds
                        Repo-->>PS: Saved Post with new id
                        PS-->>PR: New reply
                        PR-->>UI: New reply
                        UI-->>U: Show the reply under the post it answers,<br/>whose reply count goes up by one (US-07)
                    end
                end
            end
        end
    end
```

## Who does what

| Part | What it does in this flow |
|---|---|
| Web Interface | Records the reply and sends it, then shows the result |
| Auth check (middleware) | Checks the session before the request reaches the Posts route; redirects unauthenticated users |
| Posts route (controller) | Receives the authenticated request, calls the service, and returns the result. It holds no business rules |
| `PostService` | Checks the parent and recording, coordinates file/database persistence, and cleans up a saved file if the database save fails |
| `Post` (parent object) | Creates the reply through `parent.reply(audio, authorId)` |
| `PostRepository` | Reads and writes posts in SQLite (`findById`, `save`) |
| `AudioRepository` | Saves and deletes audio files (`saveFile`, `deleteFile`) |

## Notes

- `parent_post_id` points to the exact post being answered, including when replying to another reply (FR-14).
- `root_post_id` is copied from the post being answered. An original post stores its own id as its `root_post_id` (`design.md` section 4), so every reply, at any depth, gets the id of the original post and is loaded with the rest of the conversation.
- The auth middleware runs before the controller. An unauthenticated request is refused by the middleware and does not enter `PostService` (FR-03, NFR-04).
- The audio file is saved before the post. If `saveFile` fails, the service reports the failure and does not attempt the database save. If the database save fails after the file was written, the service deletes that file to avoid an orphaned audio file (NFR-06).
- `checkRecording` is shown as a `PostService` self-call. The server-side check is authoritative (FR-10).
- Database field names remain `snake_case` (`parent_post_id`, `root_post_id`, `is_deleted`); method parameters and local variables use `camelCase` (`parentId`, `authorId`, `fileName`).
- The reply count is not stored. It increases because one more post has a `parent_post_id` pointing to the answered post.
