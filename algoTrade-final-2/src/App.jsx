import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Wallet from './pages/Wallet';
import UpiPayment from './pages/UpiPayment';
import AssetDetail from './pages/AssetDetail';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSummary from './pages/OrderSummary';
import About from './pages/About';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* NEW (PE-2): public About page */}
          <Route path="/about" element={<About />} />
          {/* NEW (PE-2): short URLs from the assignment brief. The real pages live
              under /dashboard (they need a logged-in user), so we redirect. */}
          <Route path="/products" element={<Navigate to="/dashboard/market" replace />} />
          <Route path="/cart" element={<Navigate to="/dashboard/cart" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Nested routes: DashboardLayout renders the shared shell
              (sidebar/navbar) and an <Outlet /> for whichever child
              route is active below it. */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="market" element={<Market />} />
            <Route path="wallet" element={<Wallet />} />
            {/* NEW (PE-2): cart, checkout and order summary */}
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-summary" element={<OrderSummary />} />
            <Route path="upi" element={<UpiPayment />} />
            {/* Dynamic route: :coinId is a route param read via useParams() */}
            <Route path="asset/:coinId" element={<AssetDetail />} />
          </Route>

          {/* Catch-all 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
