// Settings, as in Rayyan's Figma: Account, Playback, Notifications, About,
// and Log out. Every row works; nothing here is decoration.
import { useState } from 'react';
import { api } from '../api.js';
import { go, linkTo } from '../router.js';
import { useToast } from '../components/Toast.jsx';
import { ArrowLeftIcon, ChevronIcon } from '../components/Icons.jsx';
import { SPEEDS, getAutoplay, getNotify, getSpeed, notificationsSupported, setAutoplay, setNotify, setSpeed } from '../settings.js';
import { EditProfile } from './Profile.jsx';

export const APP_VERSION = '1.0.0';

function Header({ title, back = '/feed' }) {
  return (
    <div className="settings-header">
      <a className="icon-btn" href={linkTo(back)} aria-label="Back" onClick={(e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      }}><ArrowLeftIcon /></a>
      <h1>{title}</h1>
      <span className="icon-btn" aria-hidden="true" />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="set-row">
      <span>{label}</span>
      <input type="checkbox" role="switch" className="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function LinkRow({ href, label }) {
  return (
    <a className="set-row" href={linkTo(href)}>
      <span>{label}</span><ChevronIcon />
    </a>
  );
}

export default function Settings({ onLogout }) {
  const toast = useToast();
  const [autoplay, setAuto] = useState(getAutoplay);
  const [speed, setSpd] = useState(getSpeed);
  const [notify, setNtf] = useState(getNotify);

  async function changeNotify(on) {
    const ok = await setNotify(on);
    setNtf(on && ok);
    if (on && !ok) {
      toast(notificationsSupported() ? 'Notifications are blocked. Allow them for this site in the browser settings.' : 'This browser does not support notifications.');
    } else if (on) toast('You will get a notification for new replies and followers while VoiceThread is open');
  }

  return (
    <section className="settings">
      <Header title="Settings" />

      <h2 className="set-label">Account</h2>
      <div className="set-card">
        <LinkRow href="/settings/profile" label="Edit profile" />
        <LinkRow href="/settings/password" label="Change password" />
      </div>

      <h2 className="set-label">Playback</h2>
      <div className="set-card">
        <Toggle label="Autoplay next post" checked={autoplay} onChange={(on) => { setAutoplay(on); setAuto(on); }} />
        <label className="set-row set-select">
          <span>Default speed</span>
          <span className="set-value">x{speed}<ChevronIcon /></span>
          <select value={speed} aria-label="Default speed" onChange={(e) => { const s = Number(e.target.value); setSpeed(s); setSpd(s); }}>
            {SPEEDS.map((s) => <option key={s} value={s}>x{s}</option>)}
          </select>
        </label>
      </div>

      <h2 className="set-label">Notifications</h2>
      <div className="set-card">
        <Toggle label="Push notifications" checked={notify} onChange={changeNotify} />
      </div>

      <h2 className="set-label">About</h2>
      <div className="set-card">
        <LinkRow href="/settings/terms" label="Terms of service" />
        <LinkRow href="/settings/privacy" label="Privacy policy" />
        <div className="set-row"><span>Version</span><span className="set-value">{APP_VERSION}</span></div>
      </div>

      <button type="button" className="logout-btn" onClick={onLogout}>Log out</button>
    </section>
  );
}

export function EditProfilePage({ me, onMeChange }) {
  const toast = useToast();
  return (
    <section className="settings">
      <Header title="Edit profile" back="/settings" />
      <EditProfile user={me} onCancel={() => window.history.back()} onSaved={(u) => {
        onMeChange(u);
        toast('Profile saved');
        go(`/profile/${me.id}`);
      }} />
    </section>
  );
}

export function ChangePasswordPage() {
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', repeat: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    if (form.newPassword.length < 8) return setError('The new password must be at least 8 characters.');
    if (form.newPassword !== form.repeat) return setError('The two new passwords are not the same.');
    setBusy(true);
    setError('');
    try {
      await api('POST', '/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast('Password changed. Other devices were logged out.');
      go('/settings');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section className="settings">
      <Header title="Change password" back="/settings" />
      <form className="set-card set-form stack" onSubmit={save} noValidate>
        <label className="field"><span>Current password</span>
          <input type="password" value={form.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" required />
        </label>
        <label className="field"><span>New password (at least 8 characters)</span>
          <input type="password" value={form.newPassword} onChange={set('newPassword')} autoComplete="new-password" required minLength={8} />
        </label>
        <label className="field"><span>Repeat the new password</span>
          <input type="password" value={form.repeat} onChange={set('repeat')} autoComplete="new-password" required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>Change password</button>
      </form>
    </section>
  );
}

export function TermsPage() {
  return (
    <section className="settings">
      <Header title="Terms of service" back="/settings" />
      <div className="set-card set-doc">
        <p className="muted small">VoiceThread is a student project for SWEN 360 / CMPE 460 at the American University of Bahrain (Fall 2026). It runs locally for the course and is not a commercial service.</p>
        <h2>Using VoiceThread</h2>
        <ul>
          <li>Only record yourself, or people who agreed to be recorded.</li>
          <li>Be respectful. No harassment, hate, threats or illegal content.</li>
          <li>You are responsible for what you post. You can delete your own posts and replies at any time.</li>
        </ul>
        <h2>Reports</h2>
        <p>Anyone can report a post with a written reason. The team reviews reports by hand and may remove posts that break these rules.</p>
        <h2>Your recordings</h2>
        <p>You keep ownership of your recordings. By posting, you let other users listen to them, reply to them and share links to them inside VoiceThread.</p>
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <section className="settings">
      <Header title="Privacy policy" back="/settings" />
      <div className="set-card set-doc">
        <p className="muted small">This describes what this version of VoiceThread actually does with your data.</p>
        <h2>What is stored</h2>
        <ul>
          <li>Your account: username, display name, email, bio and photo.</li>
          <li>Your password only as a salted hash. Nobody, including the team, can read it.</li>
          <li>Your voice recordings, posts, replies, likes, follows, bookmarks and reports.</li>
          <li>How many times each recording was played (a number, not who played it).</li>
        </ul>
        <h2>Where it is stored</h2>
        <p>On the computer that runs VoiceThread: a database file and a folder of audio files. Nothing is sent to other companies, and there are no ads or trackers.</p>
        <h2>Who can see what</h2>
        <ul>
          <li>Your email is never shown to other users.</li>
          <li>Your bookmarks are only visible to you.</li>
          <li>If you report a post, its author is not told who reported it.</li>
        </ul>
        <h2>Deleting</h2>
        <p>When you delete a post, its recording file is removed for good. A “post deleted” marker stays so the replies under it keep their place.</p>
      </div>
    </section>
  );
}
