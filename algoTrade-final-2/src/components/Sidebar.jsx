import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { GridIcon, TrendUpIcon, WalletIcon, PowerIcon, CartIcon } from './icons';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: GridIcon, to: '/dashboard' },
  { label: 'Market', icon: TrendUpIcon, to: '/dashboard/market' },
  { label: 'Wallet', icon: WalletIcon, to: '/dashboard/wallet' },
  { label: 'Cart', icon: CartIcon, to: '/dashboard/cart' }, // NEW (PE-2)
  { label: 'UPI', icon: null, symbol: '₹', to: '/dashboard/upi' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCart()); // NEW (PE-2): don't leave one user's cart for the next login
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size={28} />
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // NEW (PE-2): NavLink tells us whether it is the active route, so the
          // current page is highlighted. `end` = match the exact path only.
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-icon">{Icon ? <Icon width={18} height={18} /> : item.symbol}</span>
              <span className="link-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%' }}>
          <span className="sidebar-icon">
            <PowerIcon width={18} height={18} />
          </span>
          <span className="link-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
