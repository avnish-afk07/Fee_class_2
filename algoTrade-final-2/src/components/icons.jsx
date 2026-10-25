// Minimal, dependency-free line icons used in place of emoji glyphs
// across the dashboard shell. Keeping these as one shared module
// means every icon renders consistently (same stroke weight, same
// currentColor theming) instead of relying on the OS emoji font.

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5 8a5 5 0 0110 0c0 3.2 1 4.4 1.4 5H3.6C4 12.4 5 11.2 5 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 14L14 6M14 6H8M14 6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SendIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17 3L9 11M17 3l-5.5 14-3-6-6-3L17 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PowerIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 3v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 5.5a6 6 0 108 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TrendUpIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 13l5-5 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendDownIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 7l5 5 3-3 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h4v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="7.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function WalletIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LayersIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 3l7 3.5-7 3.5-7-3.5L10 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 10.5L10 14l7-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 14L10 17.5 17 14" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="10" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="1" y="10" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

export function BoltIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11 2L4 12h5l-1 6 7-10h-5l1-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// NEW (PE-2): cart icon for the navbar chip, sidebar link and quick action.
export function CartIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 3h2.2l1.9 9.2h8.2l1.7-6.4H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" />
      <circle cx="14.5" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}
