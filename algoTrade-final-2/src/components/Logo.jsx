export default function Logo({ size = 32, showWordmark = true }) {
  return (
    <div className="logo" style={{ '--logo-size': `${size}px` }}>
      <svg
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 6L40 38H30.5L24 24L17.5 38H8L24 6Z"
          fill="url(#logoGradient)"
        />
        <rect x="18" y="27" width="4" height="8" rx="1" fill="url(#logoGradient)" />
        <rect x="24" y="21" width="4" height="14" rx="1" fill="url(#logoGradient)" />
        <rect x="30" y="16" width="4" height="19" rx="1" fill="url(#logoGradient)" />
        <defs>
          <linearGradient id="logoGradient" x1="8" y1="6" x2="40" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F7CFF" />
            <stop offset="1" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span className="logo-wordmark">
          Algo<span className="logo-wordmark-accent">Trade</span>
        </span>
      )}
    </div>
  );
}
