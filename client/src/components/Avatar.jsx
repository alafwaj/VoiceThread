import { photoUrl } from '../api.js';

// The user's photo, or the grey default picture from the Figma when they have none.
export default function Avatar({ user, size = 40 }) {
  const style = { width: size, height: size };
  if (user?.photo) return <img className="avatar" src={photoUrl(user.photo)} alt="" style={style} />;
  return (
    <svg className="avatar avatar-default" viewBox="0 0 40 40" style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#d9dadd" />
      <circle cx="20" cy="15.5" r="6.5" fill="#8d9097" />
      <path d="M7.5 33.5a12.5 12.5 0 0 1 25 0A19.9 19.9 0 0 1 20 40a19.9 19.9 0 0 1-12.5-6.5Z" fill="#8d9097" />
    </svg>
  );
}
