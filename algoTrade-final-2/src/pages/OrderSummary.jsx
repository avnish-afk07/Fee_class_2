// NEW (PE-2): shown after a successful checkout. The order arrives via
// router state (useLocation); opening the URL directly sends you to the cart.
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/currency';

export default function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) return <Navigate to="/dashboard/cart" replace />;

  return (
    <>
      <div className="dashboard-section-head">
        <h2>Order placed</h2>
      </div>

      <div className="form-error-banner" role="status" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
        Thanks, {order.name.split(' ')[0]}! Your order {order.orderId} was placed successfully.
      </div>

      <section className="dashboard-card fade-in cart-summary" style={{ maxWidth: 560 }}>
        <span className="dashboard-card-label">Order summary</span>
        <div className="asset-stat-row">
          <span>Order ID</span>
          <span className="mono">{order.orderId}</span>
        </div>
        <div className="asset-stat-row">
          <span>Placed on</span>
          <span className="mono">{new Date(order.placedAt).toLocaleString()}</span>
        </div>
        {order.items.map((item) => (
          <div className="asset-stat-row" key={item.id}>
            <span>
              {item.name} ({item.coinAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {item.symbol})
            </span>
            <span className="mono">{formatINR(item.cost)}</span>
          </div>
        ))}
        <div className="asset-stat-row">
          <span>Total paid</span>
          <span className="mono">{formatINR(order.total)}</span>
        </div>

        <div className="cart-actions">
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/wallet')}>
            View wallet
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard/market')}>
            Keep trading
          </button>
        </div>
      </section>
    </>
  );
}
