// NEW (PE-2): Checkout page = order summary + a small validated form.
// On success it buys each coin, empties the Redux cart and uses
// useNavigate() to go to the order summary page.
import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { selectCartItems, selectCartTotalUsd, clearCart, removeFromCart, LOT_USD } from '../store/cartSlice';
import { usdToInr, formatINR } from '../utils/currency';
import { validateName, validateEmail, validateAgreement } from '../utils/validators';

export default function Checkout() {
  const { coins, coinsLoading, refreshHoldings } = useOutletContext();
  const { user, buyCrypto } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const totalUsd = useSelector(selectCartTotalUsd);
  const totalInr = usdToInr(totalUsd);

  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', agree: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validateAll() {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      agree: validateAgreement(form.agree),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validateAll()) return;

    if ((user?.inrBalance ?? 0) < totalInr) {
      setFormError('Insufficient balance. Add money via UPI first.');
      return;
    }

    setSubmitting(true);
    const orderItems = [];
    try {
      for (const item of items) {
        const livePrice = coins.find((c) => c.id === item.id)?.price ?? item.price;
        const coinAmount = Number(((item.quantity * LOT_USD) / livePrice).toFixed(6));
        const cost = usdToInr(item.quantity * LOT_USD);
        await buyCrypto(item.id, coinAmount, cost);
        orderItems.push({ id: item.id, name: item.name, symbol: item.symbol, quantity: item.quantity, coinAmount, cost });
        dispatch(removeFromCart(item.id)); // bought, so take it out of the cart
      }
      refreshHoldings();
      dispatch(clearCart());
      const order = {
        orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
        placedAt: new Date().toISOString(),
        name: form.name.trim(),
        email: form.email.trim(),
        items: orderItems,
        total: orderItems.reduce((sum, i) => sum + i.cost, 0),
      };
      // pass the order to the next page through router state
      navigate('/dashboard/order-summary', { state: { order }, replace: true });
    } catch (err) {
      refreshHoldings();
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <div className="dashboard-section-head">
          <h2>Checkout</h2>
        </div>
        <div className="table-status fade-in">
          <p>Your cart is empty, so there is nothing to check out.</p>
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
        <h2>Checkout</h2>
        <Link to="/dashboard/cart" className="link-accent">
          &larr; Back to cart
        </Link>
      </div>

      <section className="cart-layout">
        <form className="dashboard-card fade-in" onSubmit={handleSubmit} noValidate>
          <h3 className="checkout-title">Order details</h3>

          {formError && (
            <div className="form-error-banner" role="alert">
              {formError}{' '}
              {formError.startsWith('Insufficient') && (
                <Link to="/dashboard/upi" className="link-accent">
                  Add money
                </Link>
              )}
            </div>
          )}

          <FormInput label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />

          <label className="checkbox-field" style={{ marginBottom: 6 }}>
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <span>I understand crypto prices are volatile and orders settle at the live price.</span>
          </label>
          {errors.agree && <p className="field-error" style={{ marginTop: 8 }}>{errors.agree}</p>}

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 18 }} disabled={submitting || coinsLoading}>
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Placing order...
              </>
            ) : (
              `Pay ${formatINR(totalInr)} from UPI balance`
            )}
          </button>
        </form>

        <div className="dashboard-card fade-in cart-summary">
          <span className="dashboard-card-label">Order summary</span>
          {items.map((item) => (
            <div className="asset-stat-row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="mono">{formatINR(usdToInr(item.quantity * LOT_USD))}</span>
            </div>
          ))}
          <div className="asset-stat-row">
            <span>Total</span>
            <span className="mono">{formatINR(totalInr)}</span>
          </div>
          <div className="asset-stat-row">
            <span>UPI balance</span>
            <span className="mono">{formatINR(user?.inrBalance ?? 0)}</span>
          </div>
        </div>
      </section>
    </>
  );
}
