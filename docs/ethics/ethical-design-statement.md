# **Ethical Design Statement**

## **Privacy**

Your voice says a lot about you. Even without your name, people can often tell who you are, and it can give away things like your accent, age or how you're feeling. That's why we treat recordings as personal data. VoiceThread only turns on the microphone once you've said yes, and nothing gets saved until you've listened back and decided to post it. If you change your mind later, you can delete any of your posts or replies. When a deleted post has replies under it, we leave a small "post deleted" marker so the rest of the conversation still makes sense. We don't turn recordings into text, so there's no written copy of what anyone said. Passwords are stored as hashes and your bookmarks are only visible to you.

**Fairness**

There's no hidden ranking in the Home feed. You see posts from people you follow first, then everyone else, newest first. We don't have trending lists or an algorithm picking who gets heard, so a brand-new user's post shows up the same way as anyone else's. Topic pages work the same way, newest first. We also wanted listening to work for different people, so the player can be used with a keyboard or a screen reader, and you can \[slow it down to 0.5x\] or speed it up to 2x. To be honest, there's one gap we couldn't fix: a voice-only app is hard to use if you're deaf or can't speak, and we don't have transcripts to help with that so far.

## **Safety**

Only you can edit or delete your own posts and profile. Other people are not shown the option to do that. Recordings have to be between 30 seconds and 5 minutes, which helps keep out spam. \[We're planning to add a report button in Sprint 3, where you write a reason and someone on the team reads it and decides what to do.\] There are no private messages or live audio rooms either, so a stranger can't contact you directly.

## **One trade-off**

Free expression vs. moderation. We decided not to build automatic moderation. To check voice posts automatically, we'd need speech-to-text, which we've already ruled out. These tools also tend to get things wrong with accents and different languages, and we didn't want people flagged or silenced just because of how they speak. The downside is that if someone posts something harmful, it stays up until another user reports it and one of us checks it. We were okay with that because VoiceThread is only for a small group of students and staff, running on one laptop for the demo, so reporting, deleting and a real person reviewing things should be enough. If it were ever opened to the public, we'd need to revisit and think of another solution for this.

