import { formatUSD } from '../../utils/portfolio';

// A half-circle "speedometer" gauge, stacked from multiple colored
// arc segments (one per held asset). Built with a single arc path
// reused per segment and offset with stroke-dasharray, so no chart
// library is needed.
export default function AllocationGauge({ allocations = [], totalBalance = 0 }) {
  const r = 84;
  const cx = 110;
  const cy = 106;
  const circumference = Math.PI * r;
  const arcPath = `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`;

  let cumulative = 0;

  return (
    <div className="allocation-gauge">
      <svg viewBox="0 0 220 118" className="allocation-gauge-svg" role="img" aria-label="Portfolio allocation">
        <path
          d={arcPath}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {allocations.map((a) => {
          const segLen = (a.percent / 100) * circumference;
          const dash = `${segLen} ${circumference - segLen}`;
          const offset = -cumulative;
          cumulative += segLen;
          return (
            <path
              key={a.coin.id}
              d={arcPath}
              fill="none"
              stroke={a.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>

      <div className="allocation-gauge-center">
        <div className="allocation-gauge-value mono">{formatUSD(totalBalance)}</div>
        <div className="allocation-gauge-sub">{allocations.length} asset{allocations.length === 1 ? '' : 's'}</div>
      </div>

      <ul className="allocation-legend">
        {allocations.slice(0, 5).map((a) => (
          <li key={a.coin.id}>
            <span className="allocation-dot" style={{ background: a.color }} />
            <span className="allocation-legend-symbol">{a.coin.symbol}</span>
            <span className="allocation-legend-percent mono">{a.percent.toFixed(1)}%</span>
          </li>
        ))}
        {allocations.length === 0 && <li className="allocation-empty">No holdings yet.</li>}
      </ul>
    </div>
  );
}
