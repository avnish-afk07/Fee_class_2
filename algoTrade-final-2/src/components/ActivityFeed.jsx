import CoinIcon from './CoinIcon';
import { formatINR } from '../utils/currency';

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function findCoinById(coins, id) {
  return coins.find((c) => c.id === id);
}

export default function ActivityFeed({ activity = [], coins = [] }) {
  if (activity.length === 0) {
    return (
      <div className="activity-empty">
        <p>No activity yet. Buy an asset or add funds to see it appear here.</p>
      </div>
    );
  }

  return (
    <ul className="activity-feed">
      {activity.map((entry) => {
        if (entry.type === 'buy') {
          const coin = findCoinById(coins, entry.coinId);
          return (
            <li key={entry.id} className="activity-row">
              <div className="activity-icon-stack">
                <CoinIcon coin={coin} size={34} />
              </div>
              <div className="activity-body">
                <div className="activity-title">Purchase</div>
                <div className="activity-sub">{coin?.name ?? entry.coinId}</div>
              </div>
              <div className="activity-meta">
                <div className="mono text-success">+{entry.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {coin?.symbol}</div>
                <div className="activity-time">{timeAgo(entry.date)} · {formatINR(entry.costInInr)}</div>
              </div>
            </li>
          );
        }

        if (entry.type === 'swap') {
          const fromCoin = findCoinById(coins, entry.fromCoinId);
          const toCoin = findCoinById(coins, entry.toCoinId);
          return (
            <li key={entry.id} className="activity-row">
              <div className="activity-icon-stack">
                <CoinIcon coin={fromCoin} size={28} />
                <CoinIcon coin={toCoin} size={28} />
              </div>
              <div className="activity-body">
                <div className="activity-title">Swap</div>
                <div className="activity-sub">
                  {fromCoin?.symbol ?? entry.fromCoinId} &rarr; {toCoin?.symbol ?? entry.toCoinId}
                </div>
              </div>
              <div className="activity-meta">
                <div className="mono text-success">+{entry.toAmount.toFixed(6)} {toCoin?.symbol}</div>
                <div className="activity-time">{timeAgo(entry.date)} · -{entry.fromAmount.toFixed(6)} {fromCoin?.symbol}</div>
              </div>
            </li>
          );
        }

        return (
          <li key={entry.id} className="activity-row">
            <div className="activity-icon-stack">
              <div className="asset-symbol-badge">₹</div>
            </div>
            <div className="activity-body">
              <div className="activity-title">UPI Deposit</div>
              <div className="activity-sub">{entry.upiId}</div>
            </div>
            <div className="activity-meta">
              <div className="mono text-success">+{formatINR(entry.amount)}</div>
              <div className="activity-time">{timeAgo(entry.date)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
