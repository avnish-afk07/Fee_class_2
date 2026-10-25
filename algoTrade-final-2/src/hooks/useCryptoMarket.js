import { useEffect, useState } from 'react';
import { getMarketData } from '../api/market';

const REFRESH_INTERVAL_MS = 45000;

export default function useCryptoMarket() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setError('');
      const data = await getMarketData();
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { coins, loading, error, refresh: load };
}
