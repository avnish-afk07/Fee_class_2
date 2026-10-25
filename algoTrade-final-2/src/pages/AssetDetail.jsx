import { useMemo, useState } from 'react';
import { Link, useParams, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CoinIcon from '../components/CoinIcon';
import AreaChart from '../components/charts/AreaChart';
import { formatUSD } from '../utils/portfolio';
import { usdToInr, formatINR } from '../utils/currency';
import { classifyCoin } from '../utils/categories';

const TABS = ['Overview', 'Stats', 'News'];
const RANGES = [
  { key: '1D', hours: 24, enabled: true },
  { key: '7D', hours: 168, enabled: true },
  { key: '1M', enabled: false },
  { key: '6M', enabled: false },
  { key: '1Y', enabled: false },
  { key: 'Max', enabled: false },
];
const TRADE_USD_AMOUNT = 100;

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2.5l2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.5l-4.7 2.45.9-5.23-3.8-3.7 5.25-.76L10 2.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 4.5L6 10l6.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AssetDetail() {
  const { coinId } = useParams();
  const { coins, holdings, refreshHoldings } = useOutletContext();
  const { user, buyCrypto, sellCrypto } = useAuth();

  const [tab, setTab] = useState('Overview');
  const [range, setRange] = useState('1D');
  const [starred, setStarred] = useState(false);
  const [message, setMessage] = useState('');

  const coin = coins.find((c) => c.id === coinId);
  const held = holdings?.[coinId] ?? 0;

  const activeRange = RANGES.find((r) => r.key === range) ?? RANGES[0];
  const chartData = useMemo(() => {
    if (!coin?.sparkline?.length) return [];
    return activeRange.hours ? coin.sparkline.slice(-activeRange.hours) : coin.sparkline;
  }, [coin?.sparkline, activeRange.hours]);

  const dayStats = useMemo(() => {
    const window = coin?.sparkline?.slice(-24) ?? [];
    if (!window.length) return null;
    return { high: Math.max(...window), low: Math.min(...window) };
  }, [coin?.sparkline]);

  if (!coin) {
    return (
      <div className="dashboard-section-head">
        <h2>Asset not found</h2>
        <Link to="/dashboard/market" className="link-accent">
          &larr; Back to market
        </Link>
      </div>
    );
  }

  const isPositive = coin.change24h >= 0;
  const prevClose = coin.price / (1 + (coin.change24h ?? 0) / 100);

  async function handleBuy() {
    const qty = Number((TRADE_USD_AMOUNT / coin.price).toFixed(6));
    const costInInr = usdToInr(TRADE_USD_AMOUNT);
    try {
      await buyCrypto(coin.id, qty, costInInr);
      refreshHoldings();
      setMessage(`Bought ${qty} ${coin.symbol} for ${formatINR(costInInr)}.`);
    } catch (err) {
      setMessage(err.message);
    }
    setTimeout(() => setMessage(''), 3500);
  }

  async function handleSell() {
    if (held <= 0) {
      setMessage("You don't hold any of this asset yet.");
      setTimeout(() => setMessage(''), 3500);
      return;
    }
    const qty = Math.min(held, Number((TRADE_USD_AMOUNT / coin.price).toFixed(6)));
    const creditInr = usdToInr(qty * coin.price);
    try {
      await sellCrypto(coin.id, qty, creditInr);
      refreshHoldings();
      setMessage(`Sold ${qty} ${coin.symbol} for ${formatINR(creditInr)}.`);
    } catch (err) {
      setMessage(err.message);
    }
    setTimeout(() => setMessage(''), 3500);
  }

  return (
    <div className="asset-detail">
      <div className="asset-detail-topbar">
        <Link to="/dashboard/market" className="icon-btn" aria-label="Back to market">
          <BackIcon />
        </Link>
        <button
          className={`icon-btn${starred ? ' active' : ''}`}
          aria-label="Toggle favorite"
          onClick={() => setStarred((s) => !s)}
        >
          <StarIcon filled={starred} />
        </button>
      </div>

      <div className="asset-detail-head">
        <CoinIcon coin={coin} size={40} />
        <div>
          <div className="asset-detail-title">
            {coin.name} &mdash; {coin.symbol}
          </div>
          <div className="asset-detail-category">{classifyCoin(coin)}</div>
        </div>
      </div>

      <div className="asset-detail-tabs">
        {TABS.map((t) => (
          <button key={t} className={`asset-detail-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {message && (
        <div className="form-error-banner" role="status">
          {message}
        </div>
      )}

      {tab === 'Overview' && (
        <>
          <div className="asset-detail-price-row">
            <span className="asset-detail-price mono">{formatUSD(coin.price)}</span>
            <span className={`change-pill ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(coin.change24h).toFixed(2)}% Today
            </span>
          </div>

          <div className="asset-detail-chart-card">
            {chartData.length > 1 ? (
              <AreaChart
                data={chartData}
                height={220}
                positive={isPositive}
                showBubble
                formatValue={(v) => formatUSD(v)}
              />
            ) : (
              <div className="chart-status" style={{ height: 220 }}>
                <span>No chart data for this range.</span>
              </div>
            )}
          </div>

          <div className="asset-detail-ranges">
            {RANGES.map((r) => (
              <button
                key={r.key}
                className={`asset-detail-range${range === r.key ? ' active' : ''}${!r.enabled ? ' disabled' : ''}`}
                onClick={() => r.enabled && setRange(r.key)}
                disabled={!r.enabled}
                title={r.enabled ? undefined : 'Longer history coming soon'}
              >
                {r.key}
              </button>
            ))}
          </div>

          <div className="dashboard-section-head" style={{ marginTop: 24, marginBottom: 8 }}>
            <h2>Analytics</h2>
          </div>
          <div className="asset-detail-analytics">
            <AnalyticsCard label="Previous close" value={formatUSD(prevClose)} />
            <AnalyticsCard label="24h High" value={dayStats ? formatUSD(dayStats.high) : '—'} />
            <AnalyticsCard label="24h Low" value={dayStats ? formatUSD(dayStats.low) : '—'} />
            <AnalyticsCard label="Market Cap" value={`$${(coin.marketCap ?? 0).toLocaleString()}`} />
          </div>

          <div className="asset-detail-trade-row">
            <button className="btn btn-buy" onClick={handleBuy}>
              Buy
            </button>
            <button className="btn btn-sell" onClick={handleSell}>
              Sell
            </button>
          </div>
          <div className="asset-detail-holdings mono">
            Your holdings: {held.toLocaleString(undefined, { maximumFractionDigits: 6 })} {coin.symbol}
          </div>
        </>
      )}

      {tab === 'Stats' && (
        <div className="asset-detail-stats">
          <StatRow label="Price" value={formatUSD(coin.price)} />
          <StatRow label="24h Change" value={`${isPositive ? '+' : ''}${coin.change24h.toFixed(2)}%`} positive={isPositive} />
          <StatRow label="24h High" value={dayStats ? formatUSD(dayStats.high) : '—'} />
          <StatRow label="24h Low" value={dayStats ? formatUSD(dayStats.low) : '—'} />
          <StatRow label="Market Cap" value={`$${(coin.marketCap ?? 0).toLocaleString()}`} />
          <StatRow label="Category" value={classifyCoin(coin)} />
          <StatRow label="Symbol" value={coin.symbol} />
          <StatRow label="Your Holdings" value={`${held.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${coin.symbol}`} />
        </div>
      )}

      {tab === 'News' && (
        <div className="asset-detail-news-empty">
          <p>No live news feed is connected yet for {coin.name}. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

function AnalyticsCard({ label, value }) {
  return (
    <div className="analytics-card">
      <span className="analytics-card-label">{label}</span>
      <span className="analytics-card-value mono">{value}</span>
    </div>
  );
}

function StatRow({ label, value, positive }) {
  return (
    <div className="asset-stat-row">
      <span>{label}</span>
      <span className={`mono${positive === true ? ' text-success' : positive === false ? ' text-danger' : ''}`}>{value}</span>
    </div>
  );
}
