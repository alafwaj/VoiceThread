// Checks the API against the requirements. Run with: npm test -w server
// Uses a throwaway database and folders, so it never touches real data.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'vt-test-'));
process.env.VT_DB_FILE = join(dir, 'test.db');
process.env.VT_AUDIO_DIR = join(dir, 'audio');
process.env.VT_PHOTO_DIR = join(dir, 'photos');

const { createApp } = await import('../src/app.js');
let server, base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}/api`;
});
after(() => {
  server.close();
  rmSync(dir, { recursive: true, force: true });
});

// A tiny client that keeps one user's session cookie.
function client() {
  let cookie = '';
  return async function call(method, path, body) {
    const opts = { method, headers: { cookie } };
    if (body instanceof FormData) opts.body = body;
    else if (body) {
      opts.body = JSON.stringify(body);
      opts.headers['content-type'] = 'application/json';
    }
    const res = await fetch(base + path, opts);
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    const type = res.headers.get('content-type') || '';
    return { status: res.status, body: type.includes('json') ? await res.json() : await res.arrayBuffer() };
  };
}

function recording({ seconds = 45, type = 'audio/webm', bytes = 2000, title, topics = [1] } = {}) {
  const form = new FormData();
  form.append('audio', new Blob([new Uint8Array(bytes).fill(7)], { type }), 'rec');
  form.append('durationSeconds', String(seconds));
  if (title !== undefined) form.append('title', title);
  for (const t of topics) form.append('topicIds', String(t));
  return form;
}

const amin = client();
const omar = client();
let aminId, omarId, rootId, replyId, replyToReplyId;

test('FR-01: register checks the password, username and email', async () => {
  assert.equal((await amin('POST', '/auth/register', { username: 'amin', email: 'a@x.com', password: 'short' })).status, 400);
  const ok = await amin('POST', '/auth/register', { username: 'amin', email: 'a@x.com', password: 'password1', displayName: 'Amin' });
  assert.equal(ok.status, 201);
  aminId = ok.body.user.id;
  assert.equal((await omar('POST', '/auth/register', { username: 'AMIN', email: 'b@x.com', password: 'password1' })).status, 409);
  assert.equal((await omar('POST', '/auth/register', { username: 'omar', email: 'A@X.com', password: 'password1' })).status, 409);
  const o = await omar('POST', '/auth/register', { username: 'omar', email: 'o@x.com', password: 'password1', displayName: 'Omar' });
  omarId = o.body.user.id;
  assert.equal(o.body.user.email, undefined, 'email is never sent');
});

test('FR-02 and FR-03: log in by username or email, log out ends the session', async () => {
  const c = client();
  assert.equal((await c('POST', '/auth/login', { usernameOrEmail: 'amin', password: 'wrongpass' })).status, 401);
  assert.equal((await c('POST', '/auth/login', { usernameOrEmail: 'a@x.com', password: 'password1' })).status, 200);
  assert.equal((await c('GET', '/auth/me')).body.user.username, 'amin');
  await c('POST', '/auth/logout');
  assert.equal((await c('GET', '/auth/me')).body.user, null);
  assert.equal((await c('GET', '/posts/feed')).status, 401, 'pages that need an account refuse');
});

test('FR-09 and FR-10: publishing checks title, topics, length, size and format', async () => {
  assert.equal((await amin('POST', '/posts', recording({ title: '' }))).status, 400);
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', topics: [] }))).status, 400);
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', topics: [1, 2, 3, 4] }))).status, 400);
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', seconds: 29 }))).body.error, 'The recording is shorter than 30 seconds.');
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', seconds: 302 }))).status, 400);
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', type: 'audio/wav' }))).status, 400);
  assert.equal((await amin('POST', '/posts', recording({ title: 'T', bytes: 10 * 1024 * 1024 + 2 }))).status, 400);
  const ok = await amin('POST', '/posts', recording({ title: 'First post', topics: [1, 2] }));
  assert.equal(ok.status, 201);
  rootId = ok.body.post.id;
  assert.equal(ok.body.post.topics.length, 2);
  assert.equal(readdirSync(process.env.VT_AUDIO_DIR).length, 1, 'refused uploads leave no audio file');
});

test('FR-14: replies link to the exact post they answer, at any depth', async () => {
  const r1 = await omar('POST', `/posts/${rootId}/replies`, recording({ seconds: 31 }));
  assert.equal(r1.status, 201);
  replyId = r1.body.post.id;
  const r2 = await amin('POST', `/posts/${replyId}/replies`, recording({ seconds: 60 }));
  replyToReplyId = r2.body.post.id;
  assert.equal(r2.body.post.parentPostId, replyId);
  assert.equal(r2.body.post.rootPostId, rootId);
  assert.equal((await amin('POST', `/posts/9999/replies`, recording())).status, 404);
});

test('FR-15, FR-16 and FR-23: any post opens the whole tree with reply counts', async () => {
  const t = await omar('GET', `/posts/${replyToReplyId}/thread`);
  assert.equal(t.body.rootId, rootId);
  assert.equal(t.body.tree.post.id, rootId);
  assert.equal(t.body.tree.post.replyCount, 1);
  assert.equal(t.body.tree.children[0].post.id, replyId);
  assert.equal(t.body.tree.children[0].children[0].post.id, replyToReplyId);
  assert.equal(t.body.tree.post.title, 'First post');
});

test('FR-12: audio is served, including byte ranges for seeking', async () => {
  const res = await fetch(`${base}/posts/${rootId}/audio`, { headers: { range: 'bytes=0-9' } });
  assert.equal(res.status, 401, 'audio needs a login');
  const full = await amin('GET', `/posts/${rootId}/audio`);
  assert.equal(full.status, 200);
  assert.equal(full.body.byteLength, 2000);
});

test('FR-20 and FR-21: follow rules and feed order', async () => {
  assert.equal((await amin('POST', `/follows/${aminId}`)).status, 400, 'cannot follow yourself');
  // Omar posts after Amin, so Omar's post is newer.
  const op = await omar('POST', '/posts', recording({ title: 'Omar post', topics: [3] }));
  let feed = (await amin('GET', '/posts/feed')).body.posts.map((p) => p.id);
  assert.deepEqual(feed, [op.body.post.id, rootId], 'newest first, no replies');
  // Omar follows Amin, so Amin's older post comes first for Omar.
  await omar('POST', `/follows/${aminId}`);
  feed = (await omar('GET', '/posts/feed')).body.posts.map((p) => p.id);
  assert.deepEqual(feed, [rootId, op.body.post.id]);
  const followers = (await amin('GET', `/users/${aminId}/followers`)).body.users;
  assert.deepEqual(followers.map((u) => u.username), ['omar']);
  assert.equal(followers[0].isFollowing, false, 'Amin does not follow Omar back');
  assert.deepEqual((await amin('GET', `/users/${omarId}/following`)).body.users.map((u) => u.username), ['amin']);
  const profile = (await omar('GET', `/users/${aminId}`)).body.user;
  assert.equal(profile.followers, 1);
  assert.equal(profile.isFollowing, true);
});

test('FR-04, FR-05 and FR-19: profile, editing and topic pages', async () => {
  const posts = (await omar('GET', `/users/${aminId}/posts`)).body.posts;
  assert.deepEqual(posts.map((p) => p.id), [rootId], 'original posts only');
  const form = new FormData();
  form.append('displayName', 'Amin F');
  form.append('bio', 'Team leader');
  assert.equal((await amin('PATCH', '/users/me', form)).body.user.displayName, 'Amin F');
  const topics = (await client()('GET', '/topics')).body.topics;
  assert.ok(topics.length >= 3, 'topics are public');
  const topicPage = await client()('GET', '/topics/2/posts');
  assert.deepEqual(topicPage.body.posts.map((p) => p.id), [rootId]);
});

test('FR-22: bookmarks are private and newest first', async () => {
  await omar('POST', '/bookmarks', { postId: rootId });
  await omar('POST', '/bookmarks', { postId: replyId });
  assert.deepEqual((await omar('GET', '/bookmarks')).body.posts.map((p) => p.id), [replyId, rootId]);
  assert.equal((await amin('GET', '/bookmarks')).body.posts.length, 0);
  await omar('DELETE', `/bookmarks/${replyId}`);
  assert.deepEqual((await omar('GET', '/bookmarks')).body.posts.map((p) => p.id), [rootId]);
});

test('B-20: reports, and only moderators can list them', async () => {
  assert.equal((await omar('POST', '/reports', { postId: rootId, reason: 'Spam content' })).status, 201);
  assert.equal((await omar('GET', '/reports')).status, 403);
});

test('FR-11 and FR-18: only the author deletes; the marker keeps the tree', async () => {
  assert.equal((await omar('DELETE', `/posts/${rootId}`)).status, 403);
  assert.equal((await amin('DELETE', `/posts/${rootId}`)).status, 200);
  const t = (await omar('GET', `/posts/${replyId}/thread`)).body.tree;
  assert.equal(t.post.isDeleted, true);
  assert.equal(t.post.title, null);
  assert.equal(t.post.author, null);
  assert.equal(t.children[0].post.id, replyId, 'replies keep their place');
  assert.equal((await amin('GET', `/posts/${rootId}/audio`)).status, 404, 'audio is gone');
  assert.equal((await omar('POST', `/posts/${rootId}/replies`, recording())).status, 400, 'no replies to deleted posts');
  assert.equal((await omar('GET', '/bookmarks')).body.posts.length, 0, 'bookmarks removed');
  assert.ok(!(await omar('GET', '/posts/feed')).body.posts.some((p) => p.id === rootId));
});
