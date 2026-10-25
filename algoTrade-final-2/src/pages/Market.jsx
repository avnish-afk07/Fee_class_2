import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import SearchBar from '../components/SearchBar';
import CoinIcon from '../components/CoinIcon';
import { useAuth } from '../context/AuthContext';
import { usdToInr, formatINR } from '../utils/currency';
import { formatUSD } from '../utils/portfolio';
import { CATEGORY_FILTERS, classifyCoin } from '../utils/categories';

const BUY_USD_AMOUNT = 100; // each quick-buy spends roughly $100 worth

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="10" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="1" y="10" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12L12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Market() {
  const { coins, coinsLoading, coinsError, refresh, holdings, refreshHoldings } = useOutletContext();
  const { user, buyCrypto } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch(); // NEW (PE-2)

  const filteredCoins = useMemo(() => {
    let list = coins;
    if (category !== 'All') {
      list = list.filter((c) => classifyCoin(c) === category);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }
    return list;
  }, [coins, search, category]);

  const popular = useMemo(() => [...coins].sort((a, b) => b.marketCap - a.marketCap).slice(0, 8), [coins]);

  // NEW (PE-2): send the coin to the Redux cart and show a confirmation.
  function handleAddToCart(coin) {
    dispatch(addToCart(coin));
    setMessage(`${coin.name} added to cart.`);
    setTimeout(() => setMessage(''), 3500);
  }

  async function handleBuy(coin) {
    const qty = Number((BUY_USD_AMOUNT / coin.price).toFixed(6));
    const costInInr = usdToInr(BUY_USD_AMOUNT);

    try {
      await buyCrypto(coin.id, qty, costInInr);
      refreshHoldings();
      setMessage(`Bought ${qty} ${coin.symbol} for ${formatINR(costInInr)}.`);
    } catch (err) {
      setMessage(err.message);
    }
    setTimeout(() => setMessage(''), 3500);
  }

  return (
    <>
      <div className="market-search-bar">
        <SearchBar placeholder="Search assets" value={search} onChange={setSearch} />
        <button className="market-grid-btn" type="button" aria-label="Toggle layout">
          <GridIcon />
        </button>
      </div>

      <div className="market-category-tabs">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            className={`market-category-tab${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="form-error-banner" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
        UPI Balance: {formatINR(user?.inrBalance ?? 0)} &nbsp;
        <Link to="/dashboard/upi" className="link-accent">
          Add money
        </Link>
      </div>

      {message && <div className="form-error-banner" role="status">{message}</div>}

      {!coinsLoading && !coinsError && (
        <section>
          <div className="dashboard-section-head" style={{ marginBottom: 12 }}>
            <h2>Popular</h2>
          </div>
          <div className="market-popular-row">
            {popular.map((coin) => (
              <Link to={`/dashboard/asset/${coin.id}`} className="market-popular-card" key={coin.id}>
                <div className="market-popular-card-top">
                  <CoinIcon coin={coin} size={26} />
                  <ArrowUpRightIcon />
                </div>
                <div className="market-popular-card-name">{coin.symbol}</div>
                <div className={`market-popular-card-change mono ${coin.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
                  {coin.change24h >= 0 ? '+' : ''}
                  {coin.change24h.toFixed(2)}%
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 28 }}>
        <div className="dashboard-section-head" style={{ marginBottom: 4 }}>
          <h2>All coins &mdash; {filteredCoins.length.toLocaleString()}</h2>
        </div>

        {coinsLoading ? (
          <div className="table-status fade-in">
            <span className="spinner" />
            <p>Loading live market data...</p>
          </div>
        ) : coinsError ? (
          <div className="table-status fade-in">
            <p className="text-danger">{coinsError}</p>
            <button className="btn btn-ghost btn-sm" onClick={refresh}>
              Retry
            </button>
          </div>
        ) : filteredCoins.length === 0 ? (
          <div className="table-status fade-in">
            <p>No assets match your search.</p>
          </div>
        ) : (
          <div className="market-asset-list">
            {filteredCoins.map((coin) => {
              const held = holdings?.[coin.id] ?? 0;
              const isPositive = coin.change24h >= 0;
              return (
                <div className="market-asset-row" key={coin.id}>
                  <Link to={`/dashboard/asset/${coin.id}`} className="market-asset-link">
                    <CoinIcon coin={coin} size={38} />
                    <div className="market-asset-info">
                      <div className="market-asset-name">{coin.name}</div>
                      <div className="market-asset-category">{classifyCoin(coin)}</div>
                    </div>
                  </Link>
                  <div className="market-asset-meta">
                    <div className="market-asset-price mono">{formatUSD(coin.price)}</div>
                    <div className={`market-asset-change mono ${isPositive ? 'text-success' : 'text-danger'}`}>
                      {isPositive ? '+' : ''}
                      {coin.change24h.toFixed(2)}%
                    </div>
                  </div>
                  {held > 0 && (
                    <div className="market-asset-held mono" title="Your holdings">
                      {held.toLocaleString(undefined, { maximumFractionDigits: 4 })} {coin.symbol}
                    </div>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => handleAddToCart(coin)}>
                    Add to Cart
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleBuy(coin)}>
                    Buy
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
