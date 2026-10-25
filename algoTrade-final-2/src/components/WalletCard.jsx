import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WalletIcon, PlusIcon } from './icons';

export default function WalletCard() {
  const { user, createUserWallet } = useAuth();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateWallet = async () => {
    setCreating(true);
    setError('');
    try {
      await createUserWallet();
    } catch (err) {
      setError(err.message || 'Could not create wallet. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!user?.walletAddress) return;
    try {
      await navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied by the browser; fail silently.
    }
  };

  const walletExists = !!user?.walletAddress;

  return (
    <div className="wallet-card fade-in">
      <div className="wallet-card-icon">
        {walletExists ? <WalletIcon width={26} height={26} /> : <PlusIcon width={26} height={26} />}
      </div>

      {walletExists ? (
        <>
          <h3>Your wallet is ready</h3>
          <p>Funds and assets are held securely. View balances and transaction history any time.</p>
          <button className="wallet-address-chip" onClick={handleCopy} type="button">
            <span className="mono">{user.walletAddress}</span>
          </button>
          {copied && <p className="wallet-copied-hint">Copied to clipboard</p>}
        </>
      ) : (
        <>
          <h3>No wallet yet</h3>
          <p>Create a secure AlgoTrade wallet to start depositing, holding, and trading crypto assets.</p>
          {error && <p className="field-error">{error}</p>}
          <button className="btn btn-primary" onClick={handleCreateWallet} disabled={creating}>
            {creating ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Creating...
              </>
            ) : (
              'Create Wallet'
            )}
          </button>
        </>
      )}
    </div>
  );
}
