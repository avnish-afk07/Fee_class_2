// NEW (PE-2): Cart page. Everything it shows comes from the Redux store.
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CoinIcon from '../components/CoinIcon';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotalUsd,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  LOT_USD,
} from '../store/cartSlice';
import { usdToInr, formatINR } from '../utils/currency';

export default function Cart() {
  const { coins } = useOutletContext(); // live prices from the dashboard layout
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const totalUsd = useSelector(selectCartTotalUsd);

  // Empty cart message
  if (items.length === 0) {
    return (
      <>
        <div className="dashboard-section-head">
          <h2>Cart</h2>
        </div>
        <div className="table-status fade-in">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/market')}>
            Browse the market
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dashboard-section-head">
        <h2>Cart &mdash; {count} {count === 1 ? 'order' : 'orders'}</h2>
        <button className="link-accent" style={{ background: 'none' }} onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>

      <section className="cart-layout">
        <div className="dashboard-card fade-in">
          {items.map((item) => {
            // use the live price if we have it, else the price saved when it was added
            const livePrice = coins.find((c) => c.id === item.id)?.price ?? item.price;
            const coinAmount = (item.quantity * LOT_USD) / livePrice;
            return (
              <div className="market-asset-row cart-row" key={item.id}>
                <Link to={`/dashboard/asset/${item.id}`} className="market-asset-link">
                  <CoinIcon coin={item} size={38} />
                  <div className="market-asset-info">
                    <div className="market-asset-name">{item.name}</div>
                    <div className="market-asset-category mono">
                      ≈ {coinAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {item.symbol}
                    </div>
                  </div>
                </Link>

                <div className="qty-stepper">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="mono">{item.quantity}</span>
                  <button type="button" aria-label={`Increase ${item.name}`} onClick={() => dispatch(increaseQuantity(item.id))}>
                    +
                  </button>
                </div>

                <div className="market-asset-meta">
                  <div className="market-asset-price mono">{formatINR(usdToInr(item.quantity * LOT_USD))}</div>
                  <div className="market-asset-category mono">{item.quantity} × ${LOT_USD}</div>
                </div>

                <button className="btn btn-ghost btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="dashboard-card fade-in cart-summary">
          <span className="dashboard-card-label">Order total</span>
          <div className="balance-hero-value mono">{formatINR(usdToInr(totalUsd))}</div>
          <div className="asset-stat-row">
            <span>Items</span>
            <span className="mono">{count}</span>
          </div>
          <div className="asset-stat-row">
            <span>Total (USD)</span>
            <span className="mono">${totalUsd.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/dashboard/checkout')}>
            Proceed to checkout
          </button>
        </div>
      </section>
    </>
  );
}
