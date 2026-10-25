import { Link } from 'react-router-dom';
import CoinIcon from './CoinIcon';
import Sparkline from './charts/Sparkline';
import { formatUSD } from '../utils/portfolio';

// Ranked "leaderboard" list of coins: rank badge, name, 7d sparkline,
// price, absolute $ change, and % change - styled after a trading
// terminal's top-movers panel rather than a typical bordered table.
export default function TopCoinsLeaderboard({ coins = [], ctaTo = '/dashboard/market', ctaLabel = 'Trade Top Coins' }) {
  if (!coins.length) {
    return (
      <div className="leaderboard-empty">
        <span>No market data available right now.</span>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      {coins.map((coin, i) => {
        const isPositive = coin.change24h >= 0;
        const absChange = (coin.price * coin.change24h) / 100;
        return (
          <Link to={`/dashboard/asset/${coin.id}`} className={`leaderboard-row${i === 0 ? ' leaderboard-row-top' : ''}`} key={coin.id}>
            <span className={`leaderboard-rank${i === 0 ? ' leaderboard-rank-top' : ''}`}>{i + 1}</span>

            <span className="leaderboard-name">
              <CoinIcon coin={coin} size={30} />
              <span>
                <span className="leaderboard-name-primary">{coin.name}</span>
                <span className="leaderboard-name-symbol mono">{coin.symbol}</span>
              </span>
            </span>

            <span className="leaderboard-spark">
              <Sparkline data={coin.sparkline?.slice(-48)} width={110} height={38} positive={isPositive} />
            </span>

            <span className="leaderboard-price mono">{formatUSD(coin.price)}</span>

            <span className={`leaderboard-change mono ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '+' : '-'}
              {formatUSD(Math.abs(absChange))}
            </span>

            <span className={`leaderboard-percent mono ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '+' : '-'}
              {Math.abs(coin.change24h).toFixed(2)}%
            </span>
          </Link>
        );
      })}

      <div className="leaderboard-cta-wrap">
        <Link to={ctaTo} className="leaderboard-cta">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
