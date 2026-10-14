# Sequence diagram: publish an original post

This diagram shows, step by step, what happens when a user records and publishes an original post. It covers US-03 and US-04 and requirements FR-06 to FR-10.

The four parts of the system are the ones in the architecture diagram in section 2 of `docs/design.md`. The messages are written in plain words. The exact API addresses are chosen in Sprint 2.

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Web Interface (browser)
    participant API as API Server
    participant FS as Audio folder
    participant DB as SQLite database

    U->>UI: Open the recording screen
    UI->>UI: Ask the browser for the microphone
    alt Permission refused or no microphone
        UI-->>U: Explain how to allow the microphone (FR-06)
    else Microphone allowed
        U->>UI: Start recording
        UI-->>U: Show recording on, elapsed time and the 5 minute limit (FR-07)
        U->>UI: Stop recording (or it stops by itself at 5 minutes)
        UI-->>U: Offer listen back, record again or discard (FR-08)
        U->>UI: Enter a title, 1 to 3 topics and an optional description
        Note over UI: Publish stays disabled until the recording<br/>is at least 30 seconds long and the title<br/>and topics are filled in (FR-07, US-04)
        U->>UI: Press Publish
        UI->>API: Send the recording, title, description and topics
        API->>API: Check the user is logged in (NFR-04)
        API->>API: Check length 30 s to 5 min, size up to 10 MB,<br/>format WebM, Ogg or MP4, title present,<br/>1 to 3 topics from the fixed list (FR-09, FR-10)
        alt A check fails
            API-->>UI: Refuse, with the reason
            UI-->>U: Show why the post was refused
        else All checks pass
            API->>FS: Save the audio file
            API->>DB: Save the Post (parent_post_id empty,<br/>root_post_id = its own id) and 1 to 3 PostTopic rows
            alt Saving to the database fails
                API->>FS: Delete the audio file just saved (NFR-06)
                API-->>UI: Report that publishing failed
                UI-->>U: Show that publishing failed
            else Saved
                DB-->>API: New post id
                API-->>UI: The new post
                UI-->>U: Show the post, which now appears on the<br/>profile and in the Home feed (US-04)
            end
        end
    end
```

## Notes

- Discard on the listen-back step throws the recording away and nothing is sent to the server (US-03).
- The browser already checks the length, title and topics, but the server checks everything again, because a request can be sent without using our interface. The limits are the same on both sides.
- The audio file is saved before the database row, so a post never points to a file that does not exist. If the database save fails, the file is deleted, so no orphaned audio is left behind (NFR-06).
- Not decided yet: how the server measures the length of the recording. This is settled with backlog item B-05 in Sprint 2.
