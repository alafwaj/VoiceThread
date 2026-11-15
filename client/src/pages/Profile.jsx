// Profiles (FR-04, FR-05, FR-11, FR-20), as in wireframe 05.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { linkTo } from '../router.js';
import Avatar from '../components/Avatar.jsx';
import { BackIcon } from '../components/Icons.jsx';
import { useToast } from '../components/Toast.jsx';
import PostList from './PostList.jsx';

export function EditProfile({ user, onSaved, onCancel }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [photo, setPhoto] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData();
    data.append('displayName', displayName);
    data.append('bio', bio);
    if (photo) data.append('photo', photo);
    if (removePhoto) data.append('removePhoto', 'true');
    try {
      const { user: updated } = await api('PATCH', '/users/me', data);
      onSaved(updated);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form className="card stack" onSubmit={save}>
      <h2>Edit profile</h2>
      <label className="field"><span>Display name</span>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} required />
      </label>
      <label className="field"><span>Bio</span>
        <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />
      </label>
      <label className="field"><span>Photo (JPEG, PNG, WebP or GIF)</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setPhoto(e.target.files[0] || null)} />
      </label>
      {user.photo && (
        <label className="check"><input type="checkbox" checked={removePhoto} onChange={(e) => setRemovePhoto(e.target.checked)} /> Remove my photo</label>
      )}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="row-end">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>Save</button>
      </div>
    </form>
  );
}

export default function Profile({ userId, me, onMeChange, onLogout }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    api('GET', `/users/${userId}`).then(({ user: u }) => setUser(u)).catch((err) => setError(err.message));
    api('GET', `/users/${userId}/posts`).then(({ posts: p }) => setPosts(p)).catch((err) => setError(err.message));
  }, [userId]);

  useEffect(() => {
    setUser(null);
    setPosts(null);
    load();
  }, [load]);

  async function toggleFollow() {
    try {
      await api(user.isFollowing ? 'DELETE' : 'POST', `/follows/${user.id}`);
      toast(user.isFollowing ? `You unfollowed ${user.displayName}` : `You follow ${user.displayName}`);
      load();
    } catch (err) {
      toast(err.message);
    }
  }

  async function shareProfile() {
    const link = `${window.location.origin}${window.location.pathname}#/profile/${user.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast('Profile link copied');
    } catch {
      window.prompt('Copy this link:', link);
    }
  }

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!user) return <p className="muted" aria-live="polite">Loading…</p>;

  return (
    <section>
      {!user.isMe && (
        <button type="button" className="icon-btn profile-back" onClick={() => window.history.back()} aria-label="Go back"><BackIcon /></button>
      )}
      <div className="profile-head">
        <Avatar user={user} size={84} />
        <div className="profile-info">
          <h1 className="profile-name">{user.displayName}</h1>
          <p className="counts">
            <a href={linkTo(`/profile/${user.id}/followers`)}><strong>{user.followers}</strong> {user.followers === 1 ? 'Follower' : 'Followers'}</a>
            <a href={linkTo(`/profile/${user.id}/following`)}><strong>{user.following}</strong> Following</a>
          </p>
        </div>
      </div>
      {user.bio && <p className="profile-bio">{user.bio}</p>}

      {user.isMe ? (
        <div className="pill-row">
          <button type="button" className="pill" onClick={shareProfile}>Share profile</button>
          <a className="pill" href={linkTo('/settings/profile')}>Edit Profile</a>
        </div>
      ) : user.isFollowing ? (
        <div className="pill-row">
          <button type="button" className="pill" onClick={toggleFollow} aria-pressed="true">Following</button>
          <button type="button" className="pill" onClick={shareProfile}>Share profile</button>
        </div>
      ) : (
        <button type="button" className="btn btn-primary btn-follow" onClick={toggleFollow} aria-pressed="false">Follow</button>
      )}


      <h2 className="tab-title"><span>Posts</span></h2>
      <PostList posts={posts} me={me} onDeleted={(id) => setPosts(posts.filter((p) => p.id !== id))}
        empty={<p>{user.isMe ? 'You have not posted yet.' : 'No posts yet.'}</p>} />
    </section>
  );
}
