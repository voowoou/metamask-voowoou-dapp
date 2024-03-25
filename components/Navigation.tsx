'use client';

import { Button, Link } from '@mui/material';
import { useMetaMask } from '../hooks/useMetaMask';

const Navigation = ({}) => {
  const { wallet, hasProvider, isConnected, connectMetaMask, disconnectMetaMask } = useMetaMask();

  return (
    <div>
      <div>
        <div>Vite + React & MetaMask</div>
        <div>
          {!hasProvider && (
            <a href="https://metamask.io" target="_blank">
              Install MetaMask
            </a>
          )}
          {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
            <button disabled={isConnected} onClick={connectMetaMask}>
              Connect MetaMask
            </button>
          )}
          {hasProvider && wallet.accounts.length > 0 && (
            <a
              className="text_link tooltip-bottom"
              href={`https://etherscan.io/address/${wallet.accounts[0]}`}
              target="_blank"
              data-tooltip="Open in Block Explorer"
            >
              {wallet.accounts}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
