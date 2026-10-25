import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import AreaChart from '../components/charts/AreaChart';
import CandleChart from '../components/charts/CandleChart';
import AllocationGauge from '../components/charts/AllocationGauge';
import QuickActions from '../components/QuickActions';
import SwapPanel from '../components/SwapPanel';
import ActivityFeed from '../components/ActivityFeed';
import AssetRow from '../components/AssetRow';
import SupportedAssetsStrip from '../components/SupportedAssetsStrip';
import TopCoinsLeaderboard from '../components/TopCoinsLeaderboard';
import { TrendUpIcon, TrendDownIcon, InfoIcon, LayersIcon } from '../components/icons';
import {
  computePortfolioSummary,
  buildPortfolioSeries,
  computeAllocations,
  findCoin,
  formatUSD,
} from '../utils/portfolio';

const RANGE_TABS = ['1D', '7D'];

export default function Dashboard() {
  const { coins, coinsLoading, coinsError, refresh, holdings, refreshHoldings } = useOutletContext();
  const { user, swapAsset } = useAuth();
  const [activeRange, setActiveRange] = useState('7D');
  const [toast, setToast] = useState('');

  const summary = useMemo(() => computePortfolioSummary(coins, holdings), [coins, holdings]);
  const performanceSeries = useMemo(
    () => buildPortfolioSeries(coins, holdings, activeRange),
    [coins, holdings, activeRange]
  );
  const allocations = useMemo(() => computeAllocations(coins, holdings), [coins, holdings]);

  const btc = findCoin(coins, 'BTC');
  const eth = findCoin(coins, 'ETH');

  const marketCoin = useMemo(() => allocations[0]?.coin ?? btc ?? coins[0], [coins, allocations, btc]);

  const topMovers = useMemo(
    () =>
      [...coins]
        .sort((a, b) => Math.abs(b.change24h ?? 0) - Math.abs(a.change24h ?? 0))
        .slice(0, 4),
    [coins]
  );

  const topGainer = useMemo(
    () => [...coins].sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))[0],
    [coins]
  );
  const topLoser = useMemo(
    () => [...coins].sort((a, b) => (a.change24h ?? 0) - (b.change24h ?? 0))[0],
    [coins]
  );

  function showToast(text) {
    setToast(text);
    setTimeout(() => setToast(''), 3500);
  }

  async function handleSwap(fromId, toId, fromAmount, toAmount) {
    await swapAsset(fromId, toId, fromAmount, toAmount);
    refreshHoldings();
  }

  return (
    <>
      {coinsError && (
        <div className="form-error-banner">
          {coinsError}{' '}
          <button className="link-accent" onClick={refresh} style={{ background: 'none' }}>
            Retry
          </button>
        </div>
      )}
      {toast && <div className="form-error-banner" role="status">{toast}</div>}

      {/* ---- Balance hero + performance chart, portfolio allocation gauge ---- */}
      <h2 className="portfolio-growth-heading">Portfolio Growth</h2>

      <section className="hero-grid">
        <div className="balance-hero fade-in">
          <div className="performance-card-head">
            <div>
              <span className="dashboard-card-label">Total balance</span>
              <div className="balance-hero-value mono">
                {coinsLoading ? '—' : formatUSD(summary.totalBalance)}
              </div>
              {!coinsLoading && (
                <span className={`change-pill ${summary.isPositive ? 'positive' : 'negative'}`}>
                  {summary.isPositive ? '↑' : '↓'} {Math.abs(summary.todaysProfitPercent).toFixed(2)}% today
                </span>
              )}
            </div>
            <div className="performance-tabs">
              {RANGE_TABS.map((range) => (
                <button
                  key={range}
                  className={`performance-tab${activeRange === range ? ' active' : ''}`}
                  onClick={() => setActiveRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {coinsLoading ? (
            <div className="chart-status" style={{ height: 220 }}>
              <span className="spinner" />
              <span>Loading chart...</span>
            </div>
          ) : (
            <AreaChart data={performanceSeries} height={220} positive={summary.isPositive} />
          )}

          <QuickActions onUnavailable={showToast} />
        </div>

        <div className="allocation-card fade-in">
          <span className="dashboard-card-label">Allocation</span>
          <AllocationGauge allocations={allocations} totalBalance={summary.totalBalance} />
        </div>
      </section>

      {/* ---- Quick stats ---- */}
      <section className="stat-grid" style={{ marginTop: 24 }}>
        <DashboardCard
          label="Today's Profit"
          icon={<TrendUpIcon width={18} height={18} />}
          value={coinsLoading ? '—' : formatUSD(summary.todaysProfit)}
          delta={coinsLoading ? undefined : `${summary.todaysProfitPercent.toFixed(2)}%`}
          isPositive={summary.isPositive}
        />
        <DashboardCard
          label="BTC Price"
          icon="₿"
          value={btc ? formatUSD(btc.price) : '—'}
          delta={btc ? `${Math.abs(btc.change24h).toFixed(2)}%` : undefined}
          isPositive={btc ? btc.change24h >= 0 : true}
        />
        <DashboardCard
          label="ETH Price"
          icon="Ξ"
          value={eth ? formatUSD(eth.price) : '—'}
          delta={eth ? `${Math.abs(eth.change24h).toFixed(2)}%` : undefined}
          isPositive={eth ? eth.change24h >= 0 : true}
        />
        <DashboardCard
          label="Assets held"
          icon={<LayersIcon width={18} height={18} />}
          value={coinsLoading ? '—' : String(allocations.length)}
        />
      </section>

      {/* ---- Top coins leaderboard + supported assets ---- */}
      {!coinsLoading && topMovers.length > 0 && (
        <section className="dashboard-card fade-in" style={{ marginTop: 24 }}>
          <div className="dashboard-section-head" style={{ marginBottom: 4 }}>
            <h2>Top movers</h2>
            <Link to="/dashboard/market" className="view-all">
              View market
            </Link>
          </div>
          <TopCoinsLeaderboard coins={topMovers} />
          <SupportedAssetsStrip coins={coins} />
        </section>
      )}

      {/* ---- Market pulse candlestick chart + top holdings ---- */}
      <section className="dashboard-columns wide-left" style={{ marginTop: 24 }}>
        <div className="dashboard-card fade-in">
          <div className="dashboard-section-head" style={{ marginBottom: 12 }}>
            <h2>Market pulse</h2>
            <Link to="/dashboard/market" className="view-all">
              View market
            </Link>
          </div>
          {coinsLoading ? (
            <div className="chart-status" style={{ height: 320 }}>
              <span className="spinner" />
              <span>Loading chart...</span>
            </div>
          ) : (
            <CandleChart coin={marketCoin} />
          )}
        </div>

        <div className="dashboard-card fade-in">
          <div className="dashboard-section-head" style={{ marginBottom: 8 }}>
            <h2>Your assets</h2>
            <Link to="/dashboard/wallet" className="view-all">
              See all
            </Link>
          </div>
          {allocations.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
              You don't hold any assets yet. Visit the Market to buy your first one.
            </p>
          ) : (
            <div className="asset-row-list">
              {allocations.slice(0, 5).map((a) => (
                <AssetRow key={a.coin.id} coin={a.coin} amount={a.amount} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- Swap panel + activity feed ---- */}
      <section className="dashboard-columns wide-right" style={{ marginTop: 24 }}>
        <div className="dashboard-card fade-in">
          <SwapPanel coins={coins} holdings={holdings} onSwap={handleSwap} />
        </div>

        <div className="dashboard-card fade-in">
          <div className="dashboard-section-head" style={{ marginBottom: 8 }}>
            <h2>Recent activity</h2>
          </div>
          <ActivityFeed activity={user?.activity ?? []} coins={coins} />
        </div>
      </section>

      {/* ---- Market alerts ---- */}
      {!coinsLoading && topGainer && topLoser && (
        <section className="news-grid fade-in" style={{ marginTop: 24 }}>
          <div className="news-card news-card-positive">
            <span className="news-card-icon">
              <TrendUpIcon width={20} height={20} />
            </span>
            <p>
              <strong>{topGainer.symbol}</strong> is today's top gainer, up {topGainer.change24h.toFixed(2)}% in the last 24h.
            </p>
          </div>
          <div className="news-card news-card-negative">
            <span className="news-card-icon">
              <TrendDownIcon width={20} height={20} />
            </span>
            <p>
              <strong>{topLoser.symbol}</strong> is down {Math.abs(topLoser.change24h).toFixed(2)}% — one to watch.
            </p>
          </div>
          <div className="news-card news-card-info">
            <span className="news-card-icon">
              <InfoIcon width={20} height={20} />
            </span>
            <p>Add funds via UPI to unlock full access to buying and swapping every tracked asset.</p>
          </div>
        </section>
      )}
    </>
  );
}
