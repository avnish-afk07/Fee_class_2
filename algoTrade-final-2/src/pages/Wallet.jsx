import { useOutletContext } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import WalletCard from '../components/WalletCard';
import CryptoTable from '../components/CryptoTable';
import { useAuth } from '../context/AuthContext';
import { computePortfolioSummary, formatUSD } from '../utils/portfolio';
import { formatINR } from '../utils/currency';
import { WalletIcon } from '../components/icons';

export default function Wallet() {
  const { coins, coinsLoading, coinsError, refresh, holdings } = useOutletContext();
  const { user } = useAuth();

  const summary = computePortfolioSummary(coins, holdings);
  const heldCoins = coins.filter((c) => (holdings?.[c.id] ?? 0) > 0);

  return (
    <>
      <div className="dashboard-section-head">
        <h2>Wallet</h2>
      </div>

      <section className="stat-grid" style={{ marginBottom: 24 }}>
        <DashboardCard label="UPI / INR Balance" icon="₹" value={formatINR(user?.inrBalance ?? 0)} />
        <DashboardCard
          label="Crypto Holdings Value"
          icon={<WalletIcon width={18} height={18} />}
          value={coinsLoading ? '—' : formatUSD(summary.totalBalance)}
        />
      </section>

      <WalletCard />

      <div className="dashboard-section-head" style={{ marginTop: 32 }}>
        <h2>Your Holdings</h2>
      </div>

      {heldCoins.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>
          You don't own any crypto yet. Head to the Market page to buy some.
        </p>
      ) : (
        <CryptoTable coins={heldCoins} holdings={holdings} loading={coinsLoading} error={coinsError} onRetry={refresh} />
      )}
    </>
  );
}
