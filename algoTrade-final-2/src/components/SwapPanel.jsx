import { useEffect, useMemo, useState } from 'react';
import CoinIcon from './CoinIcon';

const FEE_RATE = 0.015; // 1.5% platform fee, shown in the breakdown below

export default function SwapPanel({ coins, holdings, onSwap }) {
  const heldCoins = useMemo(
    () => coins.filter((c) => (holdings?.[c.id] ?? 0) > 0).sort((a, b) => (holdings[b.id] * b.price) - (holdings[a.id] * a.price)),
    [coins, holdings]
  );

  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!fromId && heldCoins[0]) setFromId(heldCoins[0].id);
    if (!toId && heldCoins[1]) setToId(heldCoins[1].id);
  }, [heldCoins, fromId, toId]);

  const fromCoin = coins.find((c) => c.id === fromId);
  const toCoin = coins.find((c) => c.id === toId) ?? coins.find((c) => c.id !== fromId);
  const available = holdings?.[fromId] ?? 0;

  const parsedAmount = Number(fromAmount) || 0;
  const grossReceive = fromCoin && toCoin ? (parsedAmount * fromCoin.price) / toCoin.price : 0;
  const fee = grossReceive * FEE_RATE;
  const netReceive = Math.max(0, grossReceive - fee);
  const usdValue = fromCoin ? parsedAmount * fromCoin.price : 0;

  const insufficient = parsedAmount > available;
  const canSwap = fromCoin && toCoin && fromCoin.id !== toCoin.id && parsedAmount > 0 && !insufficient && !busy;

  async function handleSwap() {
    if (!canSwap) return;
    setBusy(true);
    setMessage(null);
    try {
      await onSwap(fromCoin.id, toCoin.id, parsedAmount, netReceive);
      setMessage({ tone: 'success', text: `Swapped ${parsedAmount} ${fromCoin.symbol} for ${netReceive.toFixed(6)} ${toCoin.symbol}.` });
      setFromAmount('');
    } catch (err) {
      setMessage({ tone: 'error', text: err.message || 'Swap failed. Please try again.' });
    } finally {
      setBusy(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  function flip() {
    const nextFrom = toId;
    const nextTo = fromId;
    setFromId(nextFrom);
    setToId(nextTo);
    setFromAmount('');
  }

  if (heldCoins.length < 2) {
    return (
      <div className="swap-panel">
        <h3 className="swap-title">Swap</h3>
        <p className="swap-empty-hint">
          Hold at least two different assets to swap between them. Buy a second asset from the Market page first.
        </p>
      </div>
    );
  }

  return (
    <div className="swap-panel">
      <h3 className="swap-title">Swap</h3>

      <div className="swap-field">
        <div className="swap-field-head">
          <span>Pay</span>
          <span>
            {available.toLocaleString(undefined, { maximumFractionDigits: 6 })} {fromCoin?.symbol}{' '}
            <button type="button" className="link-accent" onClick={() => setFromAmount(String(available))}>
              Max
            </button>
          </span>
        </div>
        <div className="swap-field-row">
          <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="swap-select">
            {heldCoins.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === toId}>
                {c.symbol}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="swap-input"
          />
        </div>
        <div className="swap-field-usd mono">≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      </div>

      <button type="button" className="swap-flip-btn" onClick={flip} aria-label="Flip swap direction">
        &#8593;&#8595;
      </button>

      <div className="swap-field">
        <div className="swap-field-head">
          <span>Receive</span>
        </div>
        <div className="swap-field-row">
          <select value={toId} onChange={(e) => setToId(e.target.value)} className="swap-select">
            {coins
              .filter((c) => c.id !== fromId)
              .slice(0, 40)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.symbol}
                </option>
              ))}
          </select>
          <div className="swap-receive-amount mono">{netReceive > 0 ? netReceive.toFixed(6) : '0.00'}</div>
        </div>
      </div>

      <div className="swap-breakdown">
        <div>
          <span>Rate</span>
          <span className="mono">
            1 {fromCoin?.symbol} ≈ {toCoin && fromCoin ? (fromCoin.price / toCoin.price).toFixed(6) : '—'} {toCoin?.symbol}
          </span>
        </div>
        <div>
          <span>Platform fee</span>
          <span className="mono">{(FEE_RATE * 100).toFixed(1)}%</span>
        </div>
        <div className="swap-breakdown-total">
          <span>You receive</span>
          <span className="mono">
            {netReceive > 0 ? netReceive.toFixed(6) : '0.00'} {toCoin?.symbol}
          </span>
        </div>
      </div>

      {insufficient && <p className="field-error">Not enough {fromCoin?.symbol} available.</p>}
      {message && (
        <p className={message.tone === 'success' ? 'text-success' : 'field-error'} role="status">
          {message.text}
        </p>
      )}

      <button type="button" className="btn btn-primary btn-block" onClick={handleSwap} disabled={!canSwap}>
        {busy ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Swapping...
          </>
        ) : (
          <>
            <CoinIcon coin={fromCoin} size={18} /> Swap
          </>
        )}
      </button>
    </div>
  );
}
