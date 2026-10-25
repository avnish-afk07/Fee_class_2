export function computePortfolioSummary(coins, holdings) {
  if (!coins.length || !holdings) {
    return { totalBalance: 0, todaysProfit: 0, todaysProfitPercent: 0, isPositive: true };
  }

  let totalBalance = 0;
  let yesterdayBalance = 0;

  coins.forEach((coin) => {
    const amount = holdings[coin.id] ?? 0;
    if (amount <= 0) return;
    const value = amount * coin.price;
    totalBalance += value;
    const changeFraction = (coin.change24h ?? 0) / 100;
    yesterdayBalance += value / (1 + changeFraction);
  });

  const todaysProfit = totalBalance - yesterdayBalance;
  const todaysProfitPercent = yesterdayBalance > 0 ? (todaysProfit / yesterdayBalance) * 100 : 0;

  return {
    totalBalance,
    todaysProfit,
    todaysProfitPercent,
    isPositive: todaysProfit >= 0,
  };
}

export function findCoin(coins, symbol) {
  return coins.find((c) => c.symbol === symbol);
}

// Builds a simple portfolio value history using the sparkline data
// already returned with the market prices, so no extra API calls
// are needed for the dashboard chart. "1D" just uses the most
// recent 24 hourly points, "7D" uses the full week.
export function buildPortfolioSeries(coins, holdings, range = '7D') {
  const held = coins.filter((c) => (holdings?.[c.id] ?? 0) > 0 && c.sparkline?.length);
  if (held.length === 0) return [];

  const pointCount = range === '1D' ? 24 : held[0].sparkline.length;
  const series = [];

  for (let i = 0; i < pointCount; i++) {
    let total = 0;
    held.forEach((coin) => {
      const points = coin.sparkline;
      const index = points.length - pointCount + i;
      if (points[index] !== undefined) {
        total += points[index] * holdings[coin.id];
      }
    });
    series.push(total);
  }

  return series;
}

// Palette cycled across held assets in the allocation gauge/legend -
// picked to stay legible against the app's dark surfaces.
export const ALLOCATION_COLORS = ['#4f7cff', '#00d4ff', '#16db93', '#ffb84f', '#ff4d6a', '#a78bfa'];

// Returns each held asset's USD value and share of the total
// portfolio, sorted largest first, with a stable color assigned.
export function computeAllocations(coins, holdings) {
  if (!coins.length || !holdings) return [];

  const rows = coins
    .map((coin) => {
      const amount = holdings[coin.id] ?? 0;
      if (amount <= 0) return null;
      return { coin, amount, value: amount * coin.price };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((sum, r) => sum + r.value, 0) || 1;

  return rows.map((row, i) => ({
    ...row,
    percent: (row.value / total) * 100,
    color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
  }));
}

export function formatUSD(value, opts = {}) {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });
}
