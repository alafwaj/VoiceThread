# Sequence diagram: load a conversation thread

This diagram shows how a whole conversation is loaded and shown as a tree, and how one of its posts is played. It covers US-08 and requirements FR-15, FR-16, FR-18 and FR-23, plus playback from US-06 (FR-12, FR-13). The query is the one in section 4 of `docs/design.md`.

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Web Interface (browser)
    participant API as API Server
    participant FS as Audio folder
    participant DB as SQLite database

    U->>UI: Open a thread (from the Home feed, a topic page,<br/>a profile or a shared link to post X)
    UI->>API: Ask for the conversation that contains post X
    API->>DB: Find post X and its root_post_id
    DB-->>API: The post, or nothing
    alt Post X does not exist
        API-->>UI: Not found
        UI-->>U: Show a clear "post not found" message (US-12)
    else Post X found
        API->>DB: SELECT * FROM posts WHERE root_post_id = (X's root_post_id),<br/>with each author's display name
        DB-->>API: Every post in the conversation
        API->>API: Build the tree by grouping posts under their parent_post_id,<br/>count the direct replies of each post (FR-16),<br/>turn deleted posts into "post deleted" markers (FR-18)
        API-->>UI: The tree
        UI-->>U: Show the original post with each reply under the post it answers (FR-15),<br/>each with speaker, length and reply count (FR-16).<br/>If opened from a link, post X is highlighted (FR-23)
        opt User plays a post
            U->>UI: Press play on a post
            UI->>API: Ask for that post's audio
            API->>FS: Read the audio file
            FS-->>API: The audio
            API-->>UI: The audio
            UI-->>U: Play it with pause, seeking and speeds 0.5x to 2x (FR-12, FR-13)
        end
    end
```

## Notes

- One query loads the whole conversation, because every post stores the `root_post_id` of its conversation. A link can point to a reply deep in the tree, so the server first looks up that post to find its `root_post_id`.
- The tree is built in memory by grouping the posts under their `parent_post_id`. This is the adjacency list from design section 4. The design says "the app" builds it without saying which part. This diagram puts it on the server, so the browser receives a finished tree with the reply counts already worked out.
- A deleted post is sent as a "post deleted" marker without its audio or title, so the replies under it keep their place (FR-18). If a shared link points to a deleted post, the marker is highlighted, so the user sees clearly that it was deleted (US-12).
- Collapsing, expanding, and moving along branches (US-09) happen in the browser on the tree that is already loaded, so they need no extra request.
- Not decided yet: whether someone who is not logged in can open a thread. FR-03 says pages that need an account send the user to the login page, but the requirements do not list which pages those are. This diagram does not show a login check for that reason.
