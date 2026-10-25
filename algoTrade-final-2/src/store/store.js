// NEW (PE-2): the Redux store. configureStore() combines our reducers
// and the store is handed to <Provider> in main.jsx.
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const STORAGE_KEY = 'algotrade_cart';

// Bonus (persistent cart): read the saved cart when the app starts, so a
// page refresh does not lose it. try/catch because localStorage can be
// blocked or contain broken JSON.
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved?.items)) return { items: saved.items };
  } catch {
    // ignore and fall back to an empty cart
  }
  return undefined; // undefined => slice uses its own initialState
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: { cart: loadCart() },
});

// Save the cart every time the store changes.
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart));
  } catch {
    // storage full / blocked - the cart still works in memory
  }
});

export default store;
