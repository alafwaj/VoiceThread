// Simple line icons. Every button that uses one also has a text label.
const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const HomeIcon = () => (<svg {...props}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>);
export const TopicsIcon = () => (<svg {...props}><path d="M4 6h16M4 12h16M4 18h10" /></svg>);
export const MicIcon = () => (<svg {...props}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>);
export const BookmarkIcon = ({ filled }) => (<svg {...props} fill={filled ? 'currentColor' : 'none'}><path d="M6 3h12v18l-6-4-6 4z" /></svg>);
export const UserIcon = () => (<svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
export const ReplyIcon = () => (<svg {...props}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 6 6v5" /></svg>);
export const LinkIcon = () => (<svg {...props}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>);
export const FlagIcon = () => (<svg {...props}><path d="M5 21V4h11l-1.5 4L16 12H5" /></svg>);
export const TrashIcon = () => (<svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /></svg>);
export const BackIcon = () => (<svg {...props}><path d="M15 18 9 12l6-6" /></svg>);
export const UpIcon = () => (<svg {...props}><path d="m6 15 6-6 6 6" /></svg>);
export const ChatIcon = () => (<svg {...props}><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" /></svg>);
export const ShareIcon = () => (<svg {...props}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg>);
export const WaveIcon = () => (<svg {...props}><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" /></svg>);
export const MoreIcon = () => (<svg {...props} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>);
export const HeartIcon = ({ filled }) => (<svg {...props} fill={filled ? 'currentColor' : 'none'}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>);
export const HeadphonesIcon = () => (<svg {...props}><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>);
export const MenuIcon = () => (<svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const BellIcon = () => (<svg {...props}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>);
export const SearchIcon = () => (<svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const ArrowLeftIcon = () => (<svg {...props}><path d="M20 12H4M10 6l-6 6 6 6" /></svg>);
export const CloseIcon = () => (<svg {...props}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const GearIcon = () => (<svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></svg>);
export const ChevronIcon = () => (<svg {...props}><path d="m9 6 6 6-6 6" /></svg>);
