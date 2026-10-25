import { useCallback, useMemo, useRef, useState } from 'react';
import CoinIcon from '../CoinIcon';

const TIMEFRAMES = [
  { key: '1D', hours: 24, buckets: 9 },
  { key: '3D', hours: 72, buckets: 13 },
  { key: '7D', hours: 168, buckets: 16 },
];

// Decorative-but-clickable drawing tools, styled after a real trading
// terminal's left rail. "Cursor" is functional (it's the default
// interaction mode, driving the crosshair below); the rest toggle an
// active state so the toolbar feels real without pretending to be a
// full charting engine.
const TOOLS = [
  { key: 'cursor', label: 'Cursor', d: 'M4 3l14 6-6 2-2 6-6-14z' },
  { key: 'trend', label: 'Trend line', d: 'M3 17L17 3M3 17h5M3 17v-5' },
  { key: 'fib', label: 'Fibonacci', d: 'M3 5h14M3 10h14M3 15h14' },
  { key: 'channel', label: 'Channel', d: 'M3 15L15 3M3 5h4v4M17 15h-4v-4' },
  { key: 'brush', label: 'Brush', d: 'M4 16l3-3 8-8 3 3-8 8-3 3H4v-3z' },
  { key: 'text', label: 'Text', d: 'M4 4h12M10 4v13' },
  { key: 'emoji', label: 'Icon', d: 'M10 4a6 6 0 100 12 6 6 0 000-12zM7.5 9h.01M12.5 9h.01M7 12c1 1 5 1 6 0' },
  { key: 'ruler', label: 'Measure', d: 'M3 13l10-10 4 4-10 10-4-4zM8 8l1.5 1.5M11 5.5L12.5 7' },
  { key: 'zoom', label: 'Zoom', d: 'M9 3a6 6 0 104.24 10.24l3.26 3.26 1.5-1.5-3.26-3.26A6 6 0 009 3z' },
];

// Groups the raw hourly sparkline prices into OHLC "candles" so we
// get a real (if approximate) candlestick view without needing a
// separate OHLC API call. Volume is a proxy: total price movement
// inside each bucket, which tracks how "active" that window was.
function buildCandles(sparkline, hours, bucketCount) {
  const slice = sparkline.slice(-hours);
  if (slice.length < 2) return [];

  const bucketSize = Math.max(1, Math.ceil(slice.length / bucketCount));
  const candles = [];

  for (let i = 0; i < slice.length; i += bucketSize) {
    const chunk = slice.slice(i, i + bucketSize);
    if (!chunk.length) continue;
    const open = chunk[0];
    const close = chunk[chunk.length - 1];
    const high = Math.max(...chunk);
    const low = Math.min(...chunk);
    let volume = 0;
    for (let j = 1; j < chunk.length; j++) volume += Math.abs(chunk[j] - chunk[j - 1]);
    candles.push({ open, close, high, low, volume: volume || Math.abs(high - low) || 0.0001 });
  }

  return candles;
}

function formatCompact(value) {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

function formatPrice(value) {
  return value >= 1 ? value.toFixed(2) : value.toFixed(4);
}

// Picks a "nice" number of price gridlines/labels for the right axis,
// independent of the candle data resolution.
function buildPriceTicks(min, max, count = 6) {
  const ticks = [];
  const step = (max - min) / (count - 1) || 1;
  for (let i = 0; i < count; i++) ticks.push(max - step * i);
  return ticks;
}

export default function CandleChart({ coin }) {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeTool, setActiveTool] = useState('cursor');
  const [hover, setHover] = useState(null); // { index, x }
  const svgRef = useRef(null);

  const tf = TIMEFRAMES.find((t) => t.key === timeframe) ?? TIMEFRAMES[0];

  const candles = useMemo(
    () => buildCandles(coin?.sparkline ?? [], tf.hours, tf.buckets),
    [coin?.sparkline, tf.hours, tf.buckets]
  );

  const stats = useMemo(() => {
    if (!candles.length) return null;
    const totalVolume = candles.reduce((s, c) => s + c.volume, 0);
    const avgVolume = totalVolume / candles.length;
    const priceMax = Math.max(...candles.map((c) => c.high));
    const priceMin = Math.min(...candles.map((c) => c.low));
    return { totalVolume, avgVolume, priceMax, priceMin };
  }, [candles]);

  const width = 760;
  const chartHeight = 300;
  const volumeHeight = 46;
  const gap = 14;
  const totalHeight = chartHeight + gap + volumeHeight;
  const rightAxisWidth = 62;
  const bottomAxisHeight = 26;

  const handleMove = useCallback(
    (e) => {
      if (activeTool !== 'cursor' || !svgRef.current || !candles.length) return;
      const rect = svgRef.current.getBoundingClientRect();
      const ratioX = (e.clientX - rect.left) / rect.width;
      const px = ratioX * width;
      const slotWidth = (width - rightAxisWidth) / candles.length;
      const idx = Math.max(0, Math.min(candles.length - 1, Math.floor(px / slotWidth)));
      setHover({ index: idx, x: idx * slotWidth + slotWidth / 2 });
    },
    [activeTool, candles.length]
  );

  if (!coin) {
    return (
      <div className="chart-status" style={{ height: 320 }}>
        <span>Select an asset to see its chart.</span>
      </div>
    );
  }

  if (!candles.length || !stats) {
    return (
      <div className="chart-status" style={{ height: 320 }}>
        <span className="spinner" />
        <span>Loading price history...</span>
      </div>
    );
  }

  const { priceMax: rawMax, priceMin: rawMin, totalVolume, avgVolume } = stats;
  const pad = (rawMax - rawMin) * 0.08 || rawMax * 0.02 || 1;
  const priceMax = rawMax + pad;
  const priceMin = rawMin - pad;
  const priceRange = priceMax - priceMin || priceMax * 0.02 || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume), 0.0001);

  const plotWidth = width - rightAxisWidth;
  const slotWidth = plotWidth / candles.length;
  const bodyWidth = Math.max(3, slotWidth * 0.5);
  const isPositive = coin.change24h >= 0;

  const priceY = (p) => chartHeight - ((p - priceMin) / priceRange) * (chartHeight - 10) - 5;
  const currentY = priceY(coin.price);
  const priceTicks = buildPriceTicks(priceMin, priceMax, 6);

  const hoverCandle = hover ? candles[hover.index] : null;
  const displayOpen = hoverCandle ? hoverCandle.open : candles[candles.length - 1].open;
  const displayHigh = hoverCandle ? hoverCandle.high : coin.price;
  const displayLow = hoverCandle ? hoverCandle.low : coin.price;
  const displayClose = hoverCandle ? hoverCandle.close : coin.price;

  // Fabricates plausible time labels for the bottom axis, spaced
  // backwards from "now" using the selected timeframe's hour span -
  // real elapsed time, just approximated per bucket rather than
  // pulled from a timestamped OHLC feed.
  const now = Date.now();
  const msPerCandle = (tf.hours * 60 * 60 * 1000) / candles.length;
  const timeLabelEvery = Math.max(1, Math.round(candles.length / 5));

  return (
    <div className="candle-terminal">
      <div className="candle-terminal-toolbar">
        {TOOLS.map((tool) => (
          <button
            key={tool.key}
            type="button"
            className={`candle-tool-btn${activeTool === tool.key ? ' active' : ''}`}
            title={tool.label}
            aria-label={tool.label}
            onClick={() => setActiveTool(tool.key)}
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={tool.d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div className="candle-terminal-main">
        <div className="candle-chart-head">
          <div>
            <div className="candle-chart-pair mono">
              <CoinIcon coin={coin} size={18} />
              {coin.name} &middot; {timeframe} &middot; CRYPTO
            </div>
            <div className="candle-chart-price">
              {formatPrice(displayClose)}
              <span className="candle-chart-usd">USD</span>
              <span className={`change-pill ${isPositive ? 'positive' : 'negative'}`} style={{ marginLeft: 10 }}>
                {isPositive ? '↑' : '↓'} {Math.abs(coin.change24h).toFixed(2)}%
              </span>
            </div>
            <div className="candle-ohlc mono">
              <span>O <strong>{formatPrice(displayOpen)}</strong></span>
              <span>H <strong>{formatPrice(displayHigh)}</strong></span>
              <span>L <strong>{formatPrice(displayLow)}</strong></span>
              <span>C <strong>{formatPrice(displayClose)}</strong></span>
            </div>
          </div>
          <div className="performance-tabs">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.key}
                className={`performance-tab${timeframe === t.key ? ' active' : ''}`}
                onClick={() => setTimeframe(t.key)}
              >
                {t.key}
              </button>
            ))}
          </div>
        </div>

        <div className="candle-stat-row">
          <div className="candle-stat">
            <span>Volume</span>
            <strong className="mono">{formatCompact(totalVolume)}</strong>
          </div>
          <div className="candle-stat">
            <span>Avg. volume</span>
            <strong className="mono">{formatCompact(avgVolume)}</strong>
          </div>
          <div className="candle-stat">
            <span>Market cap</span>
            <strong className="mono">${formatCompact(coin.marketCap ?? 0)}</strong>
          </div>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${totalHeight + bottomAxisHeight}`}
          preserveAspectRatio="none"
          className={`candle-chart-svg${activeTool === 'cursor' ? ' crosshair-cursor' : ''}`}
          role="img"
          aria-label={`${coin.symbol} candlestick chart`}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* Gridlines + right-axis price labels */}
          {priceTicks.map((p, i) => (
            <g key={i}>
              <line x1="0" y1={priceY(p)} x2={plotWidth} y2={priceY(p)} className="candle-grid-line" />
              <text x={plotWidth + 8} y={priceY(p) + 4} className="candle-axis-label">
                {formatPrice(p)}
              </text>
            </g>
          ))}

          {/* Last-price dashed line + pill */}
          <line x1="0" y1={currentY} x2={plotWidth} y2={currentY} className="candle-last-line" />
          <rect x={plotWidth + 2} y={currentY - 10} width={rightAxisWidth - 4} height="20" rx="10" className={`candle-last-pill ${isPositive ? 'positive' : 'negative'}`} />
          <text x={plotWidth + rightAxisWidth / 2 + 2} y={currentY + 4} textAnchor="middle" className="candle-last-pill-text">
            {formatPrice(coin.price)}
          </text>

          {/* Candles + volume bars */}
          {candles.map((c, i) => {
            const cx = i * slotWidth + slotWidth / 2;
            const up = c.close >= c.open;
            const colorClass = up ? 'up' : 'down';
            const bodyTop = priceY(Math.max(c.open, c.close));
            const bodyBottom = priceY(Math.min(c.open, c.close));
            const bh = Math.max(1.5, bodyBottom - bodyTop);
            const volTop = chartHeight + gap + (volumeHeight - (c.volume / maxVolume) * volumeHeight);
            const showTime = i % timeLabelEvery === 0;
            const labelDate = new Date(now - (candles.length - 1 - i) * msPerCandle);
            const timeLabel =
              tf.key === '1D'
                ? labelDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : labelDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <g key={i} className={`candle ${colorClass}`}>
                <line x1={cx} y1={priceY(c.high)} x2={cx} y2={priceY(c.low)} className="candle-wick" />
                <rect x={cx - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bh} className="candle-body" rx="1.5" />
                <rect
                  x={cx - bodyWidth / 2}
                  y={volTop}
                  width={bodyWidth}
                  height={chartHeight + gap + volumeHeight - volTop}
                  className="candle-volume"
                  rx="1.5"
                />
                {showTime && (
                  <text x={cx} y={totalHeight + bottomAxisHeight - 6} textAnchor="middle" className="candle-axis-label">
                    {timeLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Crosshair */}
          {hover && hoverCandle && (
            <g className="candle-crosshair">
              <line x1={hover.x} y1="0" x2={hover.x} y2={chartHeight} className="candle-crosshair-line" />
              <line x1="0" y1={priceY(hoverCandle.close)} x2={plotWidth} y2={priceY(hoverCandle.close)} className="candle-crosshair-line" />
              <rect
                x={plotWidth + 2}
                y={priceY(hoverCandle.close) - 10}
                width={rightAxisWidth - 4}
                height="20"
                rx="4"
                className="candle-crosshair-pill"
              />
              <text x={plotWidth + rightAxisWidth / 2 + 2} y={priceY(hoverCandle.close) + 4} textAnchor="middle" className="candle-crosshair-pill-text">
                {formatPrice(hoverCandle.close)}
              </text>
              <rect x={hover.x - 46} y={totalHeight + 4} width="92" height="18" rx="9" className="candle-crosshair-pill" />
              <text x={hover.x} y={totalHeight + bottomAxisHeight - 6} textAnchor="middle" className="candle-crosshair-pill-text">
                {new Date(now - (candles.length - 1 - hover.index) * msPerCandle).toLocaleString([], {
                  weekday: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
