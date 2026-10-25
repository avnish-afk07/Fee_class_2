import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getHoldings } from '../api/backend';
import useCryptoMarket from '../hooks/useCryptoMarket';
import '../styles/dashboard.css';

const ALERT_THRESHOLD = 3; // percent 24h move worth flagging

export default function DashboardLayout() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState({});

  function refreshHoldings() {
    if (user?.email) setHoldings(getHoldings(user.email));
  }

  useEffect(refreshHoldings, [user?.email]);

  const { coins, loading: coinsLoading, error: coinsError, refresh } = useCryptoMarket();

  const alerts = useMemo(
    () =>
      coins
        .filter((c) => Math.abs(c.change24h ?? 0) >= ALERT_THRESHOLD)
        .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
        .slice(0, 4)
        .map((c) => ({ id: c.id, symbol: c.symbol, change24h: c.change24h })),
    [coins]
  );

  const outletContext = { coins, coinsLoading, coinsError, refresh, holdings, refreshHoldings };

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar alerts={alerts} />

        <div className="dashboard-content">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}

