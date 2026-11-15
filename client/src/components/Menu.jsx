// The menu behind the ☰ button, as in the Figma: the logo, a close button,
// then Settings. Bookmarks (FR-22) and, for moderators, Reports are listed
// under it in the same style, because they need a way in.
import { useEffect, useRef } from 'react';
import { linkTo } from '../router.js';
import { BookmarkIcon, ChevronIcon, CloseIcon, FlagIcon, GearIcon } from './Icons.jsx';

export default function Menu({ me, onClose }) {
  const panel = useRef(null);
  useEffect(() => {
    panel.current?.querySelector('a, button')?.focus();
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  const row = (href, Icon, label) => (
    <a href={linkTo(href)} onClick={onClose} className="drawer-row">
      <Icon /><span>{label}</span><ChevronIcon />
    </a>
  );
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <nav className="drawer" ref={panel} aria-label="Menu" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <span className="drawer-logo">Voice<span>Thread</span></span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu"><CloseIcon /></button>
        </div>
        {row('/settings', GearIcon, 'Settings')}
        {row('/bookmarks', BookmarkIcon, 'Bookmarks')}
        {me.role === 'moderator' && row('/reports', FlagIcon, 'Reports')}
      </nav>
    </div>
  );
}
