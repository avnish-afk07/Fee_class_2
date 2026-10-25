// Lightweight, client-side category classifier. The market API gives
// us price/market-cap data but no category field, so we tag the most
// common coins ourselves and fall back to a sensible default. Good
// enough for filtering/labeling the UI without a second API call.

const CATEGORY_MAP = {
  bitcoin: 'Layer 1',
  ethereum: 'Layer 1',
  solana: 'Layer 1',
  cardano: 'Layer 1',
  avalanche_2: 'Layer 1',
  polkadot: 'Layer 1',
  near: 'Layer 1',
  tron: 'Layer 1',
  sui: 'Layer 1',
  aptos: 'Layer 1',
  cosmos: 'Layer 1',
  algorand: 'Layer 1',

  'matic-network': 'Layer 2',
  polygon: 'Layer 2',
  arbitrum: 'Layer 2',
  optimism: 'Layer 2',

  uniswap: 'DeFi',
  aave: 'DeFi',
  chainlink: 'DeFi',
  maker: 'DeFi',
  curve_dao_token: 'DeFi',
  lido_dao: 'DeFi',
  compound_governance_token: 'DeFi',
  pancakeswap_token: 'DeFi',

  dogecoin: 'Meme',
  shiba_inu: 'Meme',
  pepe: 'Meme',
  floki: 'Meme',
  bonk: 'Meme',

  tether: 'Stablecoin',
  'usd-coin': 'Stablecoin',
  dai: 'Stablecoin',
  'first-digital-usd': 'Stablecoin',

  binancecoin: 'Exchange',
  okb: 'Exchange',
  'crypto-com-chain': 'Exchange',
  leo_token: 'Exchange',

  ripple: 'Payments',
  litecoin: 'Payments',
  stellar: 'Payments',
  monero: 'Privacy',
  zcash: 'Privacy',
};

export const CATEGORY_FILTERS = ['All', 'Layer 1', 'DeFi', 'Meme', 'Stablecoin', 'Exchange'];

export function classifyCoin(coin) {
  if (!coin) return 'Altcoin';
  return CATEGORY_MAP[coin.id] ?? 'Altcoin';
}
