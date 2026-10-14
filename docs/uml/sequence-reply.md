# Sequence diagram: reply with voice

This diagram shows what happens when a user answers a post with a voice reply. The post being answered can be an original post or another reply. It covers US-07 and requirements FR-09, FR-10 and FR-14, and shows how a reply is linked into the conversation tree (section 4 of `docs/design.md`).

The recording steps are the same as for an original post (see `sequence-create-post.md`), so they are shortened to one note here.

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Web Interface (browser)
    participant API as API Server
    participant FS as Audio folder
    participant DB as SQLite database

    U->>UI: Press reply on a post in the thread
    Note over U,UI: Record, listen back, record again or discard,<br/>as for an original post (FR-06 to FR-08).<br/>A reply has no title or topics (FR-09).
    U->>UI: Press Publish
    UI->>API: Send the recording and the id of the post being answered
    API->>API: Check the user is logged in (NFR-04)
    API->>DB: Find the post being answered
    DB-->>API: The post, or nothing
    alt Post not found, or it has been deleted
        API-->>UI: Refuse: this post cannot be answered (FR-14)
        UI-->>U: Show that the post is no longer available
    else Post found
        API->>API: Check length 30 s to 5 min, size up to 10 MB,<br/>format WebM, Ogg or MP4 (FR-10)
        alt A check fails
            API-->>UI: Refuse, with the reason
            UI-->>U: Show why the reply was refused
        else All checks pass
            API->>FS: Save the audio file
            API->>DB: Save the Post with parent_post_id = the answered post's id<br/>and root_post_id = the answered post's root_post_id
            alt Saving to the database fails
                API->>FS: Delete the audio file just saved (NFR-06)
                API-->>UI: Report that the reply failed
                UI-->>U: Show that the reply failed
            else Saved
                DB-->>API: New post id
                API-->>UI: The new reply
                UI-->>U: Show the reply directly under the post it answers,<br/>whose reply count goes up by one (US-07)
            end
        end
    end
```

## Notes

- `parent_post_id` is what puts the reply in the right place in the tree. It points to the exact post being answered, at any depth (FR-14).
- `root_post_id` is copied from the post being answered, so the new reply belongs to the same conversation and is loaded with it.
- The server looks up the post being answered before saving anything, so no reply is ever saved without a valid parent (NFR-06), and nobody can answer a deleted post (US-07).
- The reply count is not stored. It goes up because there is now one more post whose `parent_post_id` points to that post.
