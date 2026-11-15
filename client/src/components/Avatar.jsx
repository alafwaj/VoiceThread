import { photoUrl } from '../api.js';

// The user's photo, or their first letter when they have none.
export default function Avatar({ user, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.42 };
  if (user?.photo) return <img className="avatar" src={photoUrl(user.photo)} alt="" style={style} />;
  return (
    <span className="avatar avatar-letter" style={style} aria-hidden="true">
      {(user?.displayName || user?.username || '?').slice(0, 1).toUpperCase()}
    </span>
  );
}
