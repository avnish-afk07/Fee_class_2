// NEW (PE-2): Redux Toolkit slice that owns ALL cart state.
// Any component can read/update the cart through useSelector/useDispatch,
// so we never pass cart data down through props.
import { createSlice } from '@reduxjs/toolkit';

// One "lot" in the cart = a $100 order of a coin. This matches the
// $100 quick-buy already used on the Market and Asset pages.
export const LOT_USD = 100;

const initialState = {
  // each item: { id, name, symbol, image, price, quantity }
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a coin, or bump its quantity if it is already in the cart.
    // (RTK uses Immer, so "mutating" state here is safe.)
    addToCart(state, action) {
      const coin = action.payload;
      const existing = state.items.find((item) => item.id === coin.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image ?? '',
          price: coin.price,
          quantity: 1,
        });
      }
    },

    // Remove a coin completely, whatever its quantity is.
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // +1 quantity. The payload is just the coin id.
    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    // -1 quantity, but never below 1 (use Remove to delete the item).
    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    // Empty the whole cart (used after checkout and on logout).
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

// Selectors: small functions that read derived data from the store.
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalUsd = (state) => selectCartCount(state) * LOT_USD;

export default cartSlice.reducer;
