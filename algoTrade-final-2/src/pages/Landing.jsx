import { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing-lume.css';

/* ---- Small inline icons (kept local so no new deps are introduced) ---- */

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.5 5.5h11M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1.7l7 2.6v5.1c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V4.3l7-2.6z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7 9.8l2 2 4-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="4" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 8h17" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 12.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function RewardsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8.3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M10 5.6v8.8M12.6 7.6c0-1-1.1-1.7-2.6-1.7-1.7 0-2.8.8-2.8 1.9 0 2.7 5.4 1.3 5.4 3.9 0 1.1-1.2 1.9-2.9 1.9-1.5 0-2.7-.7-2.7-1.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TetherIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#26A17B" />
      <path
        d="M13.15 12.68v-.01c-.08.006-.5.03-1.43.03-.74 0-1.27-.02-1.45-.03v.01c-2.4-.106-4.19-.53-4.19-1.03s1.79-.928 4.19-1.036v1.65c.18.013.72.045 1.46.045.89 0 1.34-.037 1.42-.045v-1.65c2.395.106 4.18.53 4.18 1.032s-1.785.926-4.18 1.032Zm0-2.234V9.02h3.34V6.8H7.5v2.22h3.34v1.427c-2.72.125-4.76.664-4.76 1.31 0 .645 2.04 1.184 4.76 1.31v4.694h2.31v-4.695c2.71-.125 4.75-.664 4.75-1.31 0-.645-2.04-1.183-4.75-1.31Z"
        fill="#fff"
      />
    </svg>
  );
}

function BitcoinIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#F7931A" />
      <path
        d="M16.6 10.9c.22-1.47-.9-2.26-2.43-2.79l.5-1.98-1.2-.3-.48 1.93c-.32-.08-.64-.15-.97-.23l.49-1.94-1.2-.3-.5 1.98c-.26-.06-.52-.12-.77-.18v-.01l-1.66-.42-.32 1.28s.9.2.88.21c.49.12.58.45.56.71l-1.35 5.4c-.06.15-.2.36-.53.28.01.02-.88-.22-.88-.22l-.6 1.37 1.57.39c.29.07.58.15.86.22l-.5 2 1.2.3.5-1.98c.33.09.65.17.96.25l-.49 1.96 1.2.3.5-2c2.04.39 3.58.23 4.23-1.62.52-1.48-.03-2.34-1.1-2.9.78-.18 1.37-.69 1.53-1.75Zm-2.74 3.85c-.37 1.48-2.87.68-3.68.48l.66-2.63c.81.2 3.4.6 3.02 2.15Zm.37-3.87c-.34 1.35-2.42.66-3.09.5l.6-2.39c.67.17 2.85.48 2.49 1.89Z"
        fill="#fff"
      />
    </svg>
  );
}

function SolanaIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#151321" />
      <path d="M6.6 15.3a.6.6 0 0 1 .43-.18h10.4a.3.3 0 0 1 .21.51l-1.98 1.98a.6.6 0 0 1-.43.18H4.4a.3.3 0 0 1-.21-.51l2.4-1.98Z" fill="url(#solA)" />
      <path d="M6.6 6.4a.62.62 0 0 1 .43-.18h10.4a.3.3 0 0 1 .21.51l-1.98 1.98a.6.6 0 0 1-.43.18H4.4a.3.3 0 0 1-.21-.51L6.6 6.4Z" fill="url(#solB)" />
      <path d="M15.65 10.83a.6.6 0 0 0-.43-.18H4.83a.3.3 0 0 0-.21.51l1.98 1.98c.11.11.27.18.43.18h10.4a.3.3 0 0 0 .21-.51l-1.99-1.98Z" fill="url(#solC)" />
      <defs>
        <linearGradient id="solA" x1="4.19" y1="17.8" x2="17.64" y2="17.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="solB" x1="4.19" y1="7.32" x2="17.64" y2="7.32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="solC" x1="4.6" y1="12.56" x2="18.05" y2="12.56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function EthereumIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#627EEA" />
      <path d="M12.37 3.6v6.34l5.36 2.4-5.36-8.74Z" fill="#fff" fillOpacity="0.7" />
      <path d="M12.37 3.6 7 12.34l5.37-2.4V3.6Z" fill="#fff" />
      <path d="M12.37 16.48v4.02l5.36-7.42-5.36 3.4Z" fill="#fff" fillOpacity="0.7" />
      <path d="M12.37 20.5v-4.03l-5.36-3.4 5.36 7.43Z" fill="#fff" />
      <path d="M12.37 15.5l5.36-3.4-5.36-2.4v5.8Z" fill="#fff" fillOpacity="0.4" />
      <path d="M7 12.1l5.37 3.4v-5.8L7 12.1Z" fill="#fff" fillOpacity="0.7" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <ShieldIcon />,
    title: 'Security you can trust.',
    description: 'Advanced encryption and multi-layer protection keep your assets secure.',
  },
  {
    icon: <CardIcon />,
    title: 'Seamless payments.',
    description: 'Pay anywhere, securely and instantly. Use your cryptocurrency with ease, no limits.',
  },
  {
    icon: <RewardsIcon />,
    title: 'Rewards that work for you.',
    description: 'Earn rewards on every purchase with cashback, crypto bonuses, and exclusive perks.',
  },
];

export default function Landing() {
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  // Subtle mouse-parallax on top of the CSS float animation, so the cards
  // feel alive and responsive rather than only looping on a timer.
  function handleMouseMove(e) {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;

    if (leftCardRef.current) {
      leftCardRef.current.style.transform = `rotate(-18deg) translate(${x * 10}px, ${y * 8}px)`;
    }
    if (rightCardRef.current) {
      rightCardRef.current.style.transform = `rotate(24deg) translate(${x * -12}px, ${y * -8}px)`;
    }
  }

  return (
    <div className="lume-page" onMouseMove={handleMouseMove}>
      <nav className="lume-nav">
        <div className="lume-nav-left">
          <button className="lume-menu-btn" aria-label="Open menu" type="button">
            <MenuIcon />
          </button>
          <a href="#cards" className="lume-nav-link">
            Cards
          </a>
          <a href="#whitepaper" className="lume-nav-link wp">
            White paper
          </a>
          {/* NEW (PE-2): link to the About page */}
          <Link to="/about" className="lume-nav-link">
            About
          </Link>
        </div>

        <Link to="/" className="lume-logo">
          <span className="lume-logo-dot" aria-hidden="true" />
          <span>Algotrade</span>
        </Link>

        <div className="lume-nav-right">
          <a href="https://x.com" target="_blank" rel="noreferrer" className="lume-nav-link">
            X.com
          </a>
          <Link to="/signup" className="lume-pill-btn">
            Join now
          </Link>
        </div>
      </nav>

      <header className="lume-hero">
        <div className="lume-hero-glow" aria-hidden="true" />

        <div className="lume-card-wrap left" aria-hidden="true">
          <div className="lume-card-inner" ref={leftCardRef}>
            <div className="lume-card visa">
              <div className="lume-chip" />
              <span className="lume-wordmark">VISA</span>
            </div>
          </div>
        </div>

        <div className="lume-card-wrap right" aria-hidden="true">
          <div className="lume-card-inner" ref={rightCardRef}>
            <div className="lume-card back">
              <div className="lume-chip" />
            </div>
          </div>
        </div>

        <div className="lume-hero-content">
          <span className="lume-badge">
            <CalendarIcon />
    invest now          </span>

          <h1 className="lume-title">
            Your portal
            <br />
            to tomorrow&rsquo;s
            <br />
            financial.
          </h1>

          <p className="lume-subtitle">
            Your card, powered by cryptocurrency
            <br />
            for everyday purchases.
          </p>

          <Link to="/signup" className="lume-cta">
            Join Now
          </Link>

          <div className="lume-coins">
            <span className="lume-coin">
              <TetherIcon />
              tether
            </span>
            <span className="lume-coin">
              <BitcoinIcon />
              bitcoin
            </span>
            <span className="lume-coin">
              <SolanaIcon />
              Solana
            </span>
            <span className="lume-coin">
              <EthereumIcon />
              ethereum
            </span>
          </div>
        </div>
      </header>

      <section className="lume-features">
        {FEATURES.map((feature) => (
          <div className="lume-feature" key={feature.title}>
            <span className="lume-feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
