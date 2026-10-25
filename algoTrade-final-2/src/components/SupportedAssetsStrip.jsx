import CoinIcon from './CoinIcon';

const FEATURED_SYMBOLS = ['BTC', 'ETH', 'USDT', 'SOL', 'BNB', 'XRP'];

export default function SupportedAssetsStrip({ coins = [] }) {
  const featured = FEATURED_SYMBOLS.map((symbol) => coins.find((c) => c.symbol === symbol)).filter(Boolean);

  if (featured.length === 0) return null;

  return (
    <div className="supported-assets-strip">
      <span className="supported-assets-label">Trade across</span>
      <div className="supported-assets-list">
        {featured.map((coin) => (
          <div key={coin.id} className="supported-asset-pill">
            <CoinIcon coin={coin} size={20} />
            <span>{coin.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
