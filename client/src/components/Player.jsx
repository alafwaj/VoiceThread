// The audio player (FR-12, FR-13), styled as in Rayyan's design: a round play
// button, a waveform-style track, an "x1" speed pill and the time.
// The track is a normal slider underneath, so it can be dragged or used with
// the keyboard. The bar heights are decorative (made from the post id); they
// are not the real shape of the sound.
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatTime } from '../api.js';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SPEED_KEY = 'vt_speed';
const BARS = 44;
const PLAY_EVENT = 'vt-play'; // only one recording plays at a time

function savedSpeed() {
  const s = Number(localStorage.getItem(SPEED_KEY));
  return SPEEDS.includes(s) ? s : 1;
}

function bars(seed) {
  let x = (seed * 9301 + 49297) % 233280;
  return Array.from({ length: BARS }, (_, i) => {
    x = (x * 9301 + 49297) % 233280;
    const r = x / 233280;
    const wave = 0.55 + 0.35 * Math.sin(i / 3 + seed);
    return Math.max(0.18, Math.min(1, wave * 0.6 + r * 0.55));
  });
}

export default function Player({ src, duration, label = 'recording', seed = 1 }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(savedSpeed);
  const [error, setError] = useState('');
  const total = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const heights = useMemo(() => bars(seed), [seed]);
  const done = total ? Math.min(1, time / total) : 0;

  useEffect(() => {
    const onOther = (e) => {
      if (e.detail !== audio.current && audio.current && !audio.current.paused) audio.current.pause();
    };
    const onSpeed = () => setSpeed(savedSpeed());
    window.addEventListener(PLAY_EVENT, onOther);
    window.addEventListener('vt-speed', onSpeed);
    return () => {
      window.removeEventListener(PLAY_EVENT, onOther);
      window.removeEventListener('vt-speed', onSpeed);
    };
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  async function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: a }));
      a.playbackRate = speed;
      try {
        setError('');
        await a.play();
      } catch {
        setError('This recording could not be played.');
      }
    } else a.pause();
  }

  function seek(e) {
    const value = Number(e.target.value);
    setTime(value);
    if (audio.current) audio.current.currentTime = value;
  }

  function changeSpeed(e) {
    const s = Number(e.target.value);
    localStorage.setItem(SPEED_KEY, String(s));
    window.dispatchEvent(new Event('vt-speed'));
    setSpeed(s);
  }

  return (
    <div className="player">
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onError={() => setError('This recording could not be loaded.')}
      />
      <button type="button" className="play-btn" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}>
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1" /><rect x="13.9" y="5" width="3.6" height="14" rx="1" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.8v12.4a1 1 0 0 0 1.5.86l9.7-6.2a1 1 0 0 0 0-1.72L10 4.94a1 1 0 0 0-1.5.86Z" /></svg>
        )}
      </button>
      <div className="wave">
        <div className="wave-bars" aria-hidden="true">
          {heights.map((h, i) => (
            <span key={i} className={i / BARS < done ? 'played' : ''} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
        <input
          type="range"
          min="0"
          max={total || 1}
          step="0.1"
          value={Math.min(time, total || 1)}
          onChange={seek}
          aria-label={`Position in ${label}`}
          aria-valuetext={`${formatTime(time)} of ${formatTime(total)}`}
        />
      </div>
      <label className="speed">
        <span className="sr-only">Playback speed for {label}</span>
        <select value={speed} onChange={changeSpeed}>
          {SPEEDS.map((s) => (
            <option key={s} value={s}>x{s}</option>
          ))}
        </select>
      </label>
      <span className="player-time" title={`${formatTime(time)} of ${formatTime(total)}`}>
        {playing || time > 0 ? formatTime(time) : formatTime(total)}
      </span>
      {error && <p className="error small" role="alert">{error}</p>}
    </div>
  );
}
