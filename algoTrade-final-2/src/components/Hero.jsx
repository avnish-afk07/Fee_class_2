import useCryptoMarket from '../hooks/useCryptoMarket';
import { findCoin, formatUSD } from '../utils/portfolio';

const candleSeries = [
  { open: 30, close: 42, high: 46, low: 27 },
  { open: 42, close: 38, high: 45, low: 34 },
  { open: 38, close: 50, high: 53, low: 36 },
  { open: 50, close: 47, high: 55, low: 44 },
  { open: 47, close: 60, high: 63, low: 45 },
  { open: 60, close: 58, high: 65, low: 54 },
  { open: 58, close: 70, high: 74, low: 56 },
  { open: 70, close: 66, high: 73, low: 62 },
  { open: 66, close: 78, high: 82, low: 64 },
  { open: 78, close: 88, high: 91, low: 75 },
];

export default function Hero({
  eyebrow = 'Algorithmic Trading, Simplified',
  title = 'Trade crypto with the precision of an algorithm.',
  subtitle = 'AlgoTrade blends real-time market data with automated strategies, so every position you take is backed by signal, not noise.',
}) {
  const max = Math.max(...candleSeries.map((c) => c.high));
  const { coins } = useCryptoMarket();
  const btc = findCoin(coins, 'BTC');
  const eth = findCoin(coins, 'ETH');
  const sol = findCoin(coins, 'SOL');

  return (
    <section className="auth-hero">
      <div className="auth-hero-glow" aria-hidden="true" />

      <div className="auth-hero-content">
        <span className="eyebrow mono">{eyebrow}</span>
        <h1 className="auth-hero-title">{title}</h1>
        <p className="auth-hero-subtitle">{subtitle}</p>

        <div className="auth-hero-stats">
          <div>
            <span className="mono auth-hero-stat-value">$2.4B+</span>
            <span className="auth-hero-stat-label">Volume traded</span>
          </div>
          <div>
            <span className="mono auth-hero-stat-value">140K</span>
            <span className="auth-hero-stat-label">Active traders</span>
          </div>
          <div>
            <span className="mono auth-hero-stat-value">99.98%</span>
            <span className="auth-hero-stat-label">Uptime</span>
          </div>
        </div>
      </div>

      {/* Signature element: ascending candlestick silhouette, echoing the logo mark */}
      <div className="auth-hero-candles" aria-hidden="true">
        {candleSeries.map((c, i) => {
          const bodyTop = Math.max(c.open, c.close);
          const bodyHeight = Math.abs(c.open - c.close);
          const isUp = c.close >= c.open;
          return (
            <div className="candle-col" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
              <div
                className="candle-wick"
                style={{
                  height: `${((c.high - c.low) / max) * 100}%`,
                  bottom: `${(c.low / max) * 100}%`,
                }}
              />
              <div
                className={`candle-body ${isUp ? 'up' : 'down'}`}
                style={{
                  height: `${Math.max((bodyHeight / max) * 100, 3)}%`,
                  bottom: `${(Math.min(c.open, c.close) / max) * 100}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating glass cards: live prices, so even the auth screen never shows a hardcoded number */}
      <div className="floating-card floating-card-1 glass">
        <span className="floating-card-label">BTC / USD</span>
        <span className={`floating-card-value mono ${btc && btc.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
          {btc ? `${btc.change24h >= 0 ? '+' : ''}${btc.change24h.toFixed(2)}%` : '—'}
        </span>
      </div>
      <div className="floating-card floating-card-2 glass">
        <span className="floating-card-label">SOL / USD</span>
        <span className="floating-card-value mono">{sol ? formatUSD(sol.price) : '—'}</span>
      </div>
      <div className="floating-card floating-card-3 glass">
        <span className="floating-card-label">ETH / USD</span>
        <span className={`floating-card-value mono ${eth && eth.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
          {eth ? `${eth.change24h >= 0 ? '+' : ''}${eth.change24h.toFixed(2)}%` : '—'}
        </span>
      </div>
    </section>
  );
}
