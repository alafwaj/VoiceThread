// Settings saved in this browser: autoplay, default speed and notifications.
export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function getSpeed() {
  const s = Number(localStorage.getItem('vt_speed'));
  return SPEEDS.includes(s) ? s : 1;
}
export function setSpeed(s) {
  localStorage.setItem('vt_speed', String(s));
  window.dispatchEvent(new Event('vt-speed'));
}

// Autoplay is on unless the user turned it off.
export const getAutoplay = () => localStorage.getItem('vt_autoplay') !== 'off';
export const setAutoplay = (on) => localStorage.setItem('vt_autoplay', on ? 'on' : 'off');

export const notificationsSupported = () => typeof window.Notification !== 'undefined';
export const getNotify = () => localStorage.getItem('vt_notify') === 'on' && notificationsSupported() && Notification.permission === 'granted';
export async function setNotify(on) {
  if (!on) {
    localStorage.setItem('vt_notify', 'off');
    return true;
  }
  if (!notificationsSupported()) return false;
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  localStorage.setItem('vt_notify', permission === 'granted' ? 'on' : 'off');
  return permission === 'granted';
}
