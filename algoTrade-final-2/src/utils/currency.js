export const USD_TO_INR = 83;

export function usdToInr(usd) {
  return Math.round(usd * USD_TO_INR);
}

export function formatINR(value) {
  return `\u20B9${Math.round(value).toLocaleString('en-IN')}`;
}
