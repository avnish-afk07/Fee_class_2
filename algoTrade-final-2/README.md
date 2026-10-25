# AlgoTrade

Crypto trading dashboard built with React, plain CSS, React Router, Context API and Redux Toolkit.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Build for production:

```bash
npm run build
npm run preview
```

## Routes

| Path                        | Page                              |
|------------------------------|------------------------------------|
| `/`                          | Landing page                      |
| `/login`                     | Login                             |
| `/signup`                    | Signup                            |
| `/dashboard`                 | Dashboard (protected)             |
| `/dashboard/asset/:coinId`   | Single asset detail (protected)   |
| `/about`                     | About page (public)               |
| `/dashboard/cart`            | Cart (protected) - `/cart` redirects here |
| `/dashboard/checkout`        | Checkout form + order summary     |
| `/dashboard/order-summary`   | Order confirmation after checkout |
| `/products`                  | Redirects to `/dashboard/market`  |
| `*`                          | 404 page                          |

## How it works

- Login/signup is handled entirely in the browser. Accounts are stored in
  `localStorage` as JSON (`src/api/backend.js`), and passwords are hashed
  with a simple custom function (`src/utils/crypto.js`) before being saved.
- Market prices come from CoinGecko's free public API (`src/api/market.js`),
  no API key needed.
- `/dashboard` and `/dashboard/asset/:coinId` are protected routes — you're
  redirected to `/login` if you're not signed in.

## Cart (Redux Toolkit)

- `src/store/cartSlice.js` - `createSlice` with `addToCart`, `removeFromCart`,
  `increaseQuantity`, `decreaseQuantity`, `clearCart`, plus selectors.
- `src/store/store.js` - `configureStore`; saves the cart to `localStorage` on
  every change and reloads it on startup.
- `src/main.jsx` - wraps the app in `<Provider store={store}>`.
- One cart item = a $100 order of a coin (same size as the quick-buy).
- Checkout buys each coin from the UPI/INR balance, empties the cart and
  `useNavigate()`s to the order summary.

State split: auth user = Context API, cart = Redux Toolkit,
live market data = custom hook, form inputs / UI toggles = local `useState`.

## Structure

```
src/
  api/          backend.js (auth), market.js (live prices)
  components/   reusable UI pieces
  context/      AuthContext
  store/        cartSlice, store (Redux Toolkit)
  hooks/        useCryptoMarket, usePortfolioPerformance, useScrollToHash
  pages/        route-level pages
  styles/       CSS
  utils/        crypto, validators, portfolio math
```
