import { useId, useMemo, useState } from 'react';

// A dependency-free SVG area chart. Renders a smooth-ish line with a
// soft gradient fill beneath it, plus a draggable-feeling hover dot
// that follows the pointer so the chart doesn't feel static.
export default function AreaChart({ data = [], height = 220, positive = true, showBubble = false, formatValue }) {
  const uid = useId();
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 640;

  const { linePath, areaPath, points, min, max } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '', points: [], min: 0, max: 0 };
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || max || 1;
    const padY = 16;
    const stepX = width / (data.length - 1);

    const pts = data.map((v, i) => [
      i * stepX,
      height - padY - ((v - min) / range) * (height - padY * 2),
    ]);

    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;

    return { linePath: line, areaPath: area, points: pts, min, max };
  }, [data, height]);

  if (data.length < 2) {
    return (
      <div className="chart-status" style={{ height }}>
        <span>No chart data available.</span>
      </div>
    );
  }

  const color = positive ? 'var(--color-success)' : 'var(--color-danger)';
  const active = hoverIndex ?? points.length - 1;
  const [hx, hy] = points[active];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="area-chart"
      role="img"
      aria-label="Portfolio performance chart"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const idx = Math.round(ratio * (points.length - 1));
        setHoverIndex(Math.max(0, Math.min(points.length - 1, idx)));
      }}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <defs>
        <linearGradient id={`area-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill={`url(#area-fill-${uid})`} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <line x1={hx} y1="0" x2={hx} y2={height} stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx={hx} cy={hy} r="5.5" fill={color} stroke="var(--color-bg)" strokeWidth="2.5" />

      {showBubble && formatValue && (
        <g>
          <rect
            x={Math.min(Math.max(hx - 34, 2), width - 70)}
            y={Math.max(hy - 34, 4)}
            width="68"
            height="24"
            rx="12"
            fill="#eef1f8"
          />
          <text
            x={Math.min(Math.max(hx, 36), width - 36)}
            y={Math.max(hy - 34, 4) + 16}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fontFamily="var(--font-mono)"
            fill="#0a0e17"
          >
            {formatValue(data[active])}
          </text>
        </g>
      )}
    </svg>
  );
}
