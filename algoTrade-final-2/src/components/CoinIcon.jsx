export default function CoinIcon({ coin, size = 32 }) {
  if (coin?.image) {
    return (
      <img
        src={coin.image}
        alt=""
        className="asset-icon"
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: '50%' }}
      />
    );
  }
  return (
    <div className="asset-symbol-badge" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {coin?.symbol?.slice(0, 3) ?? '?'}
    </div>
  );
}
