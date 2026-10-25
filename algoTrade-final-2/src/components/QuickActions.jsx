import { useNavigate } from 'react-router-dom';
import { ArrowUpRightIcon, SendIcon, PlusIcon, TrendUpIcon, CartIcon } from './icons';

export default function QuickActions({ onUnavailable }) {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <button
        type="button"
        className="quick-action"
        onClick={() => onUnavailable?.('Withdrawals are coming in a future release.')}
      >
        <span className="quick-action-circle">
          <ArrowUpRightIcon width={16} height={16} />
        </span>
        <span>Withdraw</span>
      </button>
      <button
        type="button"
        className="quick-action"
        onClick={() => onUnavailable?.('Sending to other traders is coming soon.')}
      >
        <span className="quick-action-circle">
          <SendIcon width={15} height={15} />
        </span>
        <span>Send</span>
      </button>
      <button type="button" className="quick-action" onClick={() => navigate('/dashboard/upi')}>
        <span className="quick-action-circle quick-action-primary">
          <PlusIcon width={16} height={16} />
        </span>
        <span>Refill</span>
      </button>
      {/* NEW (PE-2): Home buttons that navigate to Products (Market) and Cart */}
      <button type="button" className="quick-action" onClick={() => navigate('/dashboard/market')}>
        <span className="quick-action-circle">
          <TrendUpIcon width={16} height={16} />
        </span>
        <span>Market</span>
      </button>
      <button type="button" className="quick-action" onClick={() => navigate('/dashboard/cart')}>
        <span className="quick-action-circle">
          <CartIcon width={16} height={16} />
        </span>
        <span>Cart</span>
      </button>
    </div>
  );
}
