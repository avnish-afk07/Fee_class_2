# PE-2 changes (what was added on top of the old project)

## New files
| File | What it is |
|---|---|
| `src/store/cartSlice.js` | `createSlice`: 5 reducers + selectors |
| `src/store/store.js` | `configureStore` + localStorage save/load |
| `src/pages/Cart.jsx` | cart list, +/- quantity, remove, total, empty message |
| `src/pages/Checkout.jsx` | validated form (reusable inputs) + order summary, `useNavigate` |
| `src/pages/OrderSummary.jsx` | order confirmation |
| `src/pages/About.jsx` | About page with link back Home |
| `src/components/FormInput.jsx` | reusable input (label + input + error) |
| `src/styles/cart.css` | few extra styles for the new pages |

## Edited files (small edits, existing UI untouched)
| File | Change |
|---|---|
| `src/main.jsx` | wrap app in `<Provider store={store}>` |
| `src/App.jsx` | routes: /about, /products, /cart redirects, cart, checkout, order-summary |
| `src/components/Sidebar.jsx` | `Link` -> `NavLink` (active highlight), Cart link, `clearCart` on logout |
| `src/components/Navbar.jsx` | cart chip: item count + total via `useSelector` |
| `src/components/QuickActions.jsx` | Market + Cart buttons (use `useNavigate`) |
| `src/pages/Market.jsx` | "Add to Cart" button + confirmation message (`useDispatch`) |
| `src/pages/Landing.jsx` | About link in the nav |
| `src/components/icons.jsx` | `CartIcon` |
| `src/utils/validators.js` | `validateAgreement` |

## Flow to explain in the viva
Click "Add to Cart" -> `dispatch(addToCart(coin))` -> reducer updates `state.cart.items`
-> store notifies subscribers -> `useSelector` in Navbar/Cart re-renders
-> `store.subscribe` also writes the cart to localStorage.

## Checklist mapping
- Navbar item count + total: `Navbar.jsx`
- Cart total: `Cart.jsx`
- Empty cart message: `Cart.jsx`, `Checkout.jsx`
- Active link: `Sidebar.jsx` (`NavLink`)
- 404: `NotFound.jsx` (already existed)
- Add-to-cart confirmation: `Market.jsx`
- Bonus 1 search/filter: already in `Market.jsx`
- Bonus 2 persistent cart: `store.js`
- Bonus 3 checkout + `useNavigate`: `Checkout.jsx`
