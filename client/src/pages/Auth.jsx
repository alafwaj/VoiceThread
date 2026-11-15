// Welcome, log in and sign up (FR-01, FR-02), as in wireframe 01-login.
import { useState } from 'react';
import { api } from '../api.js';
import { go, linkTo } from '../router.js';
import Logo from '../components/Logo.jsx';
import { BackIcon } from '../components/Icons.jsx';

export function Welcome() {
  return (
    <main className="auth auth-welcome">
      <Logo big />
      <p className="tagline">Talk it out. Every reply answers one voice.</p>
      <div className="stack">
        <a className="btn btn-primary btn-block" href={linkTo('/login')}>Log in</a>
        <a className="btn btn-outline btn-block" href={linkTo('/signup')}>Sign up</a>
      </div>
    </main>
  );
}

function AuthForm({ title, subtitle, children, onSubmit, error, busy, submitLabel, footer }) {
  return (
    <main className="auth">
      <a className="icon-btn" href={linkTo('/')} aria-label="Back to the welcome page"><BackIcon /></a>
      <h1>{title}</h1>
      <p className="muted">{subtitle}</p>
      <form className="stack" onSubmit={onSubmit} noValidate>
        {children}
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Please wait…' : submitLabel}</button>
      </form>
      <p className="center muted">{footer}</p>
    </main>
  );
}

export function Login({ onAuth }) {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { user } = await api('POST', '/auth/login', form);
      onAuth(user);
      go('/feed');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthForm title="Log in" subtitle="Welcome back. Log in to continue the conversations." onSubmit={submit} error={error} busy={busy}
      submitLabel="Log in" footer={<>No account? <a href={linkTo('/signup')}>Sign up</a></>}>
      <label className="field"><span>Username or email</span>
        <input value={form.usernameOrEmail} onChange={set('usernameOrEmail')} autoComplete="username" required autoFocus />
      </label>
      <label className="field"><span>Password</span>
        <input type="password" value={form.password} onChange={set('password')} autoComplete="current-password" required />
      </label>
    </AuthForm>
  );
}

export function Signup({ onAuth }) {
  const [form, setForm] = useState({ displayName: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 8) return setError('The password must be at least 8 characters.');
    setBusy(true);
    setError('');
    try {
      const { user } = await api('POST', '/auth/register', form);
      onAuth(user);
      go('/feed');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthForm title="Sign up" subtitle="Create your account to start talking." onSubmit={submit} error={error} busy={busy}
      submitLabel="Create account" footer={<>Have an account? <a href={linkTo('/login')}>Log in</a></>}>
      <label className="field"><span>Full name</span>
        <input value={form.displayName} onChange={set('displayName')} autoComplete="name" maxLength={50} autoFocus />
      </label>
      <label className="field"><span>Email</span>
        <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
      </label>
      <label className="field"><span>Username</span>
        <input value={form.username} onChange={set('username')} autoComplete="username" required maxLength={30} />
      </label>
      <label className="field"><span>Password (at least 8 characters)</span>
        <input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" required minLength={8} />
      </label>
    </AuthForm>
  );
}
