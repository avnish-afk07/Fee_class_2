import { Link } from 'react-router-dom';
import CoinIcon from './CoinIcon';
import Sparkline from './charts/Sparkline';
import { formatUSD } from '../utils/portfolio';

export default function AssetRow({ coin, amount }) {
  const value = amount * coin.price;
  const isPositive = coin.change24h >= 0;

  return (
    <Link to={`/dashboard/asset/${coin.id}`} className="asset-row">
      <CoinIcon coin={coin} size={38} />
      <div className="asset-row-info">
        <div className="asset-row-name">{coin.name}</div>
        <div className="asset-row-amount mono">
          {amount.toLocaleString(undefined, { maximumFractionDigits: 5 })} {coin.symbol}
        </div>
      </div>
      <div className="asset-row-spark">
        <Sparkline data={coin.sparkline?.slice(-48)} positive={isPositive} />
      </div>
      <div className="asset-row-value">
        <div className="mono">{formatUSD(value)}</div>
        <div className={isPositive ? 'text-success' : 'text-danger'} style={{ fontSize: '0.78rem' }}>
          {isPositive ? '↑' : '↓'} {Math.abs(coin.change24h).toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}
