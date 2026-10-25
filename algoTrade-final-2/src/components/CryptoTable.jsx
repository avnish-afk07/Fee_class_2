import { Link } from 'react-router-dom';

function formatPrice(price) {
  return price >= 1
    ? price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : `$${price.toFixed(4)}`;
}

function formatMarketCap(cap) {
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `${(cap / 1e6).toFixed(2)}M`;
  return cap.toLocaleString();
}

export default function CryptoTable({ coins, holdings, loading, error, onRetry, onAdd }) {
  if (loading) {
    return (
      <div className="crypto-table-wrap fade-in table-status">
        <span className="spinner" />
        <p>Loading live market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crypto-table-wrap fade-in table-status">
        <p className="text-danger">{error}</p>
        <button className="btn btn-ghost btn-sm" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="crypto-table-wrap fade-in table-status">
        <p>No assets match your search.</p>
      </div>
    );
  }

  return (
    <div className="crypto-table-wrap fade-in">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Market Cap</th>
            <th>Holdings</th>
            {onAdd && <th></th>}
          </tr>
        </thead>
        <tbody>
          {coins.map((asset) => {
            const held = holdings?.[asset.id] ?? 0;
            return (
              <tr key={asset.id}>
                <td>
                  <Link to={`/dashboard/asset/${asset.id}`} className="asset-cell">
                    {asset.image ? (
                      <img src={asset.image} alt="" className="asset-icon" width={28} height={28} />
                    ) : (
                      <div className="asset-symbol-badge">{asset.symbol.slice(0, 3)}</div>
                    )}
                    <div>
                      <div className="asset-name">{asset.name}</div>
                      <div className="asset-symbol">{asset.symbol}</div>
                    </div>
                  </Link>
                </td>
                <td className="mono">{formatPrice(asset.price)}</td>
                <td>
                  <span className={`change-pill ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {asset.change24h >= 0 ? '↑' : '↓'} {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="mono">${formatMarketCap(asset.marketCap)}</td>
                <td className="mono">{held.toLocaleString()}</td>
                {onAdd && (
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => onAdd(asset)}>
                      Buy
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
