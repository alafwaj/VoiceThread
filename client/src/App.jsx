// The app shell: checks who is logged in, shows the right page for the
// address, and the bottom bar that is on every screen after log in.
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { go, linkTo, useRoute } from './router.js';
import { ToastProvider } from './components/Toast.jsx';
import Avatar from './components/Avatar.jsx';
import Menu from './components/Menu.jsx';
import { BellIcon, HomeIcon, MenuIcon, MicIcon, SearchIcon, WaveIcon } from './components/Icons.jsx';
import Search from './pages/Search.jsx';
import Settings, { ChangePasswordPage, EditProfilePage, PrivacyPage, TermsPage } from './pages/Settings.jsx';
import { getNotify } from './settings.js';
import Notifications, { SEEN_KEY } from './pages/Notifications.jsx';
import { Login, Signup, Welcome } from './pages/Auth.jsx';
import Feed from './pages/Feed.jsx';
import Thread from './pages/Thread.jsx';
import Record from './pages/Record.jsx';
import Profile from './pages/Profile.jsx';
import { TopicList, TopicPage } from './pages/Topics.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import Reports from './pages/Reports.jsx';
import Follows from './pages/Follows.jsx';

const PUBLIC = ['', 'login', 'signup'];

function NavBar({ route, me }) {
  const item = (href, label, icon, active) => (
    <a href={linkTo(href)} className={`nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={label} title={label}>
      {icon}
    </a>
  );
  const onMyProfile = route.name === 'profile' && Number(route.params[0]) === me.id;
  return (
    <nav className="navbar" aria-label="Main">
      {item('/feed', 'Home', <HomeIcon />, route.name === 'feed')}
      {item('/topics', 'Topics', <WaveIcon />, route.name === 'topics')}
      <a href={linkTo('/record')} className={`nav-record${route.name === 'record' ? ' active' : ''}`} aria-label="Record a new post" title="Record">
        <MicIcon />
      </a>
      {item('/search', 'Search', <SearchIcon />, route.name === 'search')}
      {item(`/profile/${me.id}`, 'My profile', <Avatar user={me} size={30} />, onMyProfile)}
    </nav>
  );
}

function Page({ route, me, setMe, logout, onSeen }) {
  const id = Number(route.params[0]);
  switch (route.name) {
    case 'feed': return <Feed me={me} />;
    case 'thread': return <Thread key={id} postId={id} me={me} />;
    case 'record': return route.params[0] === 'reply' ? <Record key={`r${route.params[1]}`} replyToId={Number(route.params[1])} /> : <Record key="new" />;
    case 'profile':
      if (route.params[1] === 'followers' || route.params[1] === 'following') {
        return <Follows key={`${id}-${route.params[1]}`} userId={id} which={route.params[1]} me={me} />;
      }
      return <Profile key={id} userId={id} me={me} onMeChange={(u) => setMe({ ...me, ...u })} onLogout={logout} />;
    case 'topics': return route.params[0] ? <TopicPage key={id} topicId={id} me={me} /> : <TopicList />;
    case 'bookmarks': return <Bookmarks me={me} />;
    case 'search': return <Search me={me} />;
    case 'settings':
      if (route.params[0] === 'profile') return <EditProfilePage me={me} onMeChange={(u) => setMe({ ...me, ...u })} />;
      if (route.params[0] === 'password') return <ChangePasswordPage />;
      if (route.params[0] === 'terms') return <TermsPage />;
      if (route.params[0] === 'privacy') return <PrivacyPage />;
      return <Settings onLogout={logout} />;
    case 'notifications': return <Notifications onSeen={onSeen} />;
    case 'reports': return <Reports />;
    default: return <p className="empty">This page does not exist. <a href={linkTo('/feed')}>Go home</a></p>;
  }
}

export default function App() {
  const route = useRoute();
  const [me, setMe] = useState(undefined); // undefined while checking
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(false);

  // The red dot on the bell: is there activity newer than the last time the user looked?
  const checkActivity = useCallback(() => {
    api('GET', '/notifications')
      .then(({ notifications }) => {
        const seen = localStorage.getItem(SEEN_KEY) || '';
        setUnread(Boolean(notifications[0] && notifications[0].createdAt > seen));
      })
      .catch(() => {});
  }, []);
  const onSeen = useCallback(() => setUnread(false), []);

  useEffect(() => {
    if (me) checkActivity();
  }, [me, route.name, checkActivity]);

  // Settings > Push notifications: show a browser notification for new activity.
  useEffect(() => {
    if (!me) return undefined;
    const tick = () => {
      if (!getNotify()) return;
      api('GET', '/notifications').then(({ notifications }) => {
        const last = localStorage.getItem('vt_notified') || new Date().toISOString().slice(0, 19).replace('T', ' ');
        const fresh = notifications.filter((n) => n.createdAt > last);
        if (notifications[0]) localStorage.setItem('vt_notified', notifications[0].createdAt > last ? notifications[0].createdAt : last);
        else localStorage.setItem('vt_notified', last);
        fresh.slice(0, 3).forEach((n) => {
          const text = n.type === 'reply' ? `${n.username} replied to ${n.parentTitle ? `“${n.parentTitle}”` : 'your reply'}` : `${n.username} started following you`;
          const note = new Notification('VoiceThread', { body: text, tag: `${n.type}-${n.postId ?? n.userId}-${n.createdAt}` });
          note.onclick = () => {
            window.focus();
            go(n.type === 'reply' ? `/thread/${n.postId}` : `/profile/${n.userId}`);
          };
        });
        if (fresh.length) setUnread(true);
      }).catch(() => {});
    };
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, [me]);

  useEffect(() => {
    api('GET', '/auth/me').then(({ user }) => setMe(user)).catch(() => setMe(null));
  }, []);

  // Pages that need an account send visitors to log in, and come back after (FR-03).
  useEffect(() => {
    if (me === undefined) return;
    if (!me && !PUBLIC.includes(route.name)) {
      sessionStorage.setItem('vt_after_login', window.location.hash);
      go('/login');
    } else if (me && PUBLIC.includes(route.name)) {
      const back = sessionStorage.getItem('vt_after_login');
      sessionStorage.removeItem('vt_after_login');
      go(back && back !== '#/login' ? back.slice(1) : '/feed');
    }
  }, [me, route.name]);

  async function logout() {
    await api('POST', '/auth/logout').catch(() => {});
    setMe(null);
    go('/');
  }

  if (me === undefined) return <p className="muted center pad">Loading…</p>;

  if (!me) {
    return (
      <ToastProvider>
        {route.name === 'login' ? <Login onAuth={setMe} /> : route.name === 'signup' ? <Signup onAuth={setMe} /> : <Welcome />}
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <a className="skip" href="#main">Skip to content</a>
      {route.name !== 'profile' && route.name !== 'settings' && (
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Open the menu" aria-expanded={menuOpen}><MenuIcon /></button>
        <a href={linkTo('/feed')} className="wordmark" aria-label="VoiceThread home">Voice <span>Thread</span></a>
        <a href={linkTo('/notifications')} className={`icon-btn bell${unread ? ' bell-new' : ''}`} aria-label={unread ? 'Activity, new' : 'Activity'}>
          <BellIcon />
        </a>
      </header>
      )}
      {menuOpen && <Menu me={me} onClose={() => setMenuOpen(false)} />}
      <main id="main" className="content">
        <Page route={route} me={me} setMe={setMe} logout={logout} onSeen={onSeen} />
      </main>
      <NavBar route={route} me={me} />
    </ToastProvider>
  );
}
