import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import { BoltIcon } from '../components/icons';

export default function UpiPayment() {
  const { user, payWithUpi } = useAuth();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await payWithUpi(upiId, Number(amount));
      setSuccess(`${formatINR(Number(amount))} added to your wallet via UPI.`);
      setUpiId('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="dashboard-section-head">
        <h2>UPI Payments</h2>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="dashboard-card fade-in">
          <div className="dashboard-card-head">
            <span className="dashboard-card-label">INR Balance</span>
          </div>
          <div className="dashboard-card-value mono">
            {formatINR(user?.inrBalance ?? 0)}
          </div>
        </div>
      </div>

      <div className="performance-card fade-in" style={{ maxWidth: 420 }}>
        <h3 style={{ marginBottom: 16 }}>Add Money via UPI</h3>

        {error && <div className="form-error-banner">{error}</div>}
        {success && <div className="form-error-banner" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field-label">UPI ID</span>
            <input
              type="text"
              placeholder="yourname@bank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Amount (₹)</span>
            <input
              type="number"
              min="1"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Processing...
              </>
            ) : (
              'Pay via UPI'
            )}
          </button>
        </form>
      </div>

      <div className="dashboard-section-head" style={{ marginTop: 32 }}>
        <h2>Recent Transactions</h2>
      </div>

      {(user?.upiTransactions ?? []).length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>No UPI payments yet.</p>
      ) : (
        <div className="crypto-table-wrap fade-in">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>UPI ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {user.upiTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="mono">{txn.upiId}</td>
                  <td className="mono">{formatINR(txn.amount)}</td>
                  <td className="mono">{new Date(txn.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---- High-frequency trading: placeholder only, no logic yet ---- */}
      <div className="dashboard-section-head" style={{ marginTop: 32 }}>
        <h2>High-Frequency Trading</h2>
        <span className="hft-badge">Under construction</span>
      </div>

      <div className="hft-panel fade-in">
        <div className="hft-panel-glow" aria-hidden="true" />
        <div className="hft-panel-icon">
          <BoltIcon width={22} height={22} />
        </div>
        <h3>Automated micro-trade execution is on the way</h3>
        <p>
          We're building a low-latency engine to place and close many small trades a second based on
          your own rules. This panel is a preview only — no strategies run yet.
        </p>

        <div className="hft-panel-skeleton">
          <div className="hft-skeleton-row">
            <span className="hft-skeleton-bar" style={{ width: '38%' }} />
            <span className="hft-skeleton-bar" style={{ width: '18%' }} />
            <span className="hft-skeleton-bar" style={{ width: '14%' }} />
          </div>
          <div className="hft-skeleton-row">
            <span className="hft-skeleton-bar" style={{ width: '52%' }} />
            <span className="hft-skeleton-bar" style={{ width: '20%' }} />
            <span className="hft-skeleton-bar" style={{ width: '10%' }} />
          </div>
          <div className="hft-skeleton-row">
            <span className="hft-skeleton-bar" style={{ width: '30%' }} />
            <span className="hft-skeleton-bar" style={{ width: '24%' }} />
            <span className="hft-skeleton-bar" style={{ width: '16%' }} />
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" disabled style={{ marginTop: 18, opacity: 0.6, cursor: 'not-allowed' }}>
          Configure strategy — coming soon
        </button>
      </div>
    </>
  );
}
