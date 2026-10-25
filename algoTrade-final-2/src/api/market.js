const BASE_URL = 'https://api.coingecko.com/api/v3';

// Top 100 real coins by market cap - covers the whole market, not
// just a handful of fixed coins.
export async function getMarketData(perPage = 100) {
  const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Could not load market data. Please try again.');
  }

  const data = await res.json();

  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap,
    image: coin.image,
    sparkline: coin.sparkline_in_7d ? coin.sparkline_in_7d.price : [],
  }));
}
