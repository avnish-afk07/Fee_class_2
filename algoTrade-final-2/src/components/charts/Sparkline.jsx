// Minimal inline chart used inside compact rows/cards where a full
// axis-and-legend chart would be too heavy.
export default function Sparkline({ data = [], width = 96, height = 34, positive = true }) {
  if (!data || data.length < 2) {
    return <svg width={width} height={height} aria-hidden="true" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(height - ((v - min) / range) * (height - 4) - 2).toFixed(1)}`)
    .join(' ');

  const color = positive ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
