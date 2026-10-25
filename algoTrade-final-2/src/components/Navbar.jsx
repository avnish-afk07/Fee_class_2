import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { BellIcon, CartIcon } from './icons';
import { selectCartCount, selectCartTotalUsd } from '../store/cartSlice';
import { usdToInr, formatINR } from '../utils/currency';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function Navbar({ alerts = [] }) {
  const { user } = useAuth();
  const [showAlerts, setShowAlerts] = useState(false);
  // NEW (PE-2): read the cart straight from the Redux store
  const cartCount = useSelector(selectCartCount);
  const cartTotalInr = usdToInr(useSelector(selectCartTotalUsd));
  const firstName = user?.name?.split(' ')[0] ?? 'Trader';

  return (
    <header className="topnav">
      <div>
        <div className="topnav-greeting-eyebrow mono">{getTodayLabel()}</div>
        <h1 className="topnav-greeting">
          {getGreeting()}, {firstName}
        </h1>
      </div>

      <div className="topnav-actions">
        <Link to="/dashboard/cart" className="cart-chip" aria-label={`Cart, ${cartCount} items`}>
          <CartIcon width={18} height={18} />
          <span className="cart-chip-count mono">{cartCount}</span>
          <span className="cart-chip-total mono">{formatINR(cartTotalInr)}</span>
        </Link>
        <div className="notif-wrap">
          <button
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => setShowAlerts((s) => !s)}
          >
            <BellIcon width={18} height={18} />
            {alerts.length > 0 && <span className="dot" />}
          </button>
          {showAlerts && (
            <div className="notif-dropdown glass">
              <div className="notif-dropdown-head">Price alerts</div>
              {alerts.length === 0 ? (
                <p className="notif-empty">No notable moves right now.</p>
              ) : (
                alerts.map((alert) => (
                  <div className="notif-item" key={alert.id}>
                    <span className={alert.change24h >= 0 ? 'text-success' : 'text-danger'}>
                      {alert.change24h >= 0 ? '↑' : '↓'} {alert.symbol}
                    </span>
                    <span className="notif-detail">
                      {Math.abs(alert.change24h).toFixed(1)}% in the last 24h
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="user-chip">
          <div className="user-avatar">{user?.initials ?? '?'}</div>
          <span className="link-label">{user?.name ?? 'Trader'}</span>
        </div>
      </div>
    </header>
  );
}
