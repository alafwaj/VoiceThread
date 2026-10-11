# How to contribute

Git steps for the team. Go through them in order the first time. After that you only need sections 3 to 6.

You need Git installed (https://git-scm.com). From Sprint 2 you also need Node.js LTS (https://nodejs.org). Run the commands in a terminal: Git Bash or PowerShell on Windows, Terminal on a Mac.

## 1. Clone the repository (once)

Accept the GitHub invitation first, then:

```bash
git clone https://github.com/alafwaj/VoiceThread.git
cd VoiceThread
```

The first time, a browser window opens and asks you to sign in to GitHub.

## 2. Set your identity (once)

Your commits have to carry your own name and the email of your own GitHub account. That is how the instructor sees who did what.

```bash
git config --global user.name "Your Full Name"
git config --global user.email "the-email-on-your-github-account"
```

Check it:

```bash
git config --global user.name
git config --global user.email
```

## 3. Start a piece of work

Always start from the latest `main`, on a new branch of your own.

```bash
git checkout main
git pull
git checkout -b docs/user-stories
```

Name the branch after the work, as `type/short-name`:

| Your work | Example branch name |
|---|---|
| Package 1 | `docs/user-stories` |
| Package 2 | `docs/requirements` |
| Package 3 | `docs/design` |
| Package 4 | `design/wireframes` |
| Package 5 | `docs/backlog` |
| Meeting records | `docs/standup-oct-11` |

## 4. Save your work in small commits

Commit whenever you finish a small part, for example one section of your document. Several small commits over several days are better than one big commit at the end.

```bash
git status
git add docs/requirements.md
git commit -m "docs: add user stories for recording and playback"
```

`git status` shows what you changed, `git add` picks the files to save, and `git commit` saves them with a message.

Commit messages start with a type and say what the commit does:

| Type | Use it for | Example |
|---|---|---|
| `docs:` | Documents | `docs: add non-functional requirements` |
| `design:` | Wireframes and diagrams | `design: add thread view wireframe` |
| `chore:` | Setup and housekeeping | `chore: add wireframes folder` |
| `fix:` | Correcting a mistake | `fix: correct reply duration in requirements` |
| `feat:` | New application features (from Sprint 2) | `feat: add login form` |

Don't write messages like `update`, `stuff`, `changes`, or `final2`.

## 5. Upload your branch

```bash
git push -u origin docs/user-stories
```

After the first push of a branch, plain `git push` is enough.

## 6. Open a pull request

1. Open https://github.com/alafwaj/VoiceThread in your browser.
2. Click the yellow Compare & pull request button that shows up after you push.
3. Give it a clear title, for example "Add user stories".
4. In the description, write `Closes #` followed by your card's number (for example `Closes #1`), so the card closes when the pull request is merged.
5. On the right, under Reviewers, add alafwaj (Amin) and one teammate.
6. Click Create pull request.
7. On the board, drag your card to In review.

## 7. Respond to the review

If changes are requested, make them on the same branch, then commit and push again. The pull request updates by itself.

```bash
git add docs/requirements.md
git commit -m "docs: clarify acceptance criteria for replies"
git push
```

## 8. Review a teammate's pull request

Everyone reviews at least one pull request per sprint.

1. Open the Pull requests tab and pick one that is not yours.
2. Click Files changed and read it.
3. Leave at least one real comment: something unclear, something missing, or something that disagrees with another document. Click the + beside a line to comment on it.
4. Click Review changes, choose Comment, Approve, or Request changes, and submit.

## 9. Common problems

| Problem | What to do |
|---|---|
| `git push` is rejected | Someone else changed `main`. Run `git pull origin main`, then `git push` again |
| "Merge conflict" in a file | Open the file, find the lines marked `<<<<<<<` and `>>>>>>>`, keep the right text, delete the markers, then `git add` the file and `git commit` |
| You committed on `main` by mistake | Do not push. Ask the team leader before doing anything else |
| You are not sure what state you are in | Run `git status` and read what it says |

## Rules

- Never commit directly to `main`.
- Never commit passwords, keys, or `.env` files.
- Commit only your own work, from your own account.
