// NEW (PE-2): public About page with a link back to Home.
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function About() {
  return (
    <div className="not-found-page about-page">
      <Link to="/" className="auth-page-nav">
        <Logo size={26} />
      </Link>
      <div className="not-found-content about-content">
        <span className="eyebrow mono">About</span>
        <h1>About AlgoTrade</h1>
        <p>
          AlgoTrade is a demo crypto trading dashboard. Track live prices from CoinGecko, add UPI balance, and
          buy, sell or swap assets in a few clicks.
        </p>
        <p>
          Browse the market, add coins to your cart in $100 orders, adjust quantities, then check out in one go.
          Your cart is saved in the browser, so it is still there after a refresh.
        </p>
        <p>Built with React, React Router, Context API and Redux Toolkit. No real money is involved.</p>
        <Link to="/" className="btn btn-primary">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
