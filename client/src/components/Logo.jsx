// The VoiceThread logo: a red tile with sound bars, then the name.
export default function Logo({ big = false }) {
  return (
    <span className={`logo${big ? ' logo-big' : ''}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="9" />
        <g stroke="#fff" strokeWidth="3.2" strokeLinecap="round">
          <path d="M11 17v6M16.5 13v14M22 10v20M27.5 14v12M33 18v4" />
        </g>
      </svg>
      <span className="logo-text">Voice<b>Thread</b></span>
    </span>
  );
}
