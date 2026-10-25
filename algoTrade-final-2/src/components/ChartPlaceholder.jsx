export default function ChartPlaceholder({ data = [], height = 160, loading, error }) {
  if (loading) {
    return (
      <div className="chart-status" style={{ height }}>
        <span className="spinner" />
        <span>Loading chart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-status" style={{ height }}>
        <span className="text-danger">{error}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-status" style={{ height }}>
        <span>No chart data available.</span>
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  return (
    <div className="chart-placeholder" style={{ height }} role="img" aria-label="Performance chart">
      {data.map((value, i) => (
        <div
          key={i}
          className="chart-bar"
          style={{
            height: `${((value - min) / range) * 100}%`,
            animationDelay: `${Math.min(i * 0.01, 1)}s`,
          }}
          title={`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
      ))}
    </div>
  );
}
