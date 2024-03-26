'use client';

import { Button, Link } from '@mui/material';
import { useMetaMask } from '../hooks/useMetaMask';

const Navigation = ({}) => {
  const { wallet, hasProvider, connectMetaMask } = useMetaMask();
  const isMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask; // Проверяем, установлено ли MetaMask Extension, избегая ошибки 'window is undefined'

  return (
    <>
      {!hasProvider ? (
        <Link href="https://metamask.io" target="_blank">
          Install MetaMask
        </Link>
      ) : isMetaMask && wallet.accounts.length < 1 ? (
        <Button variant="contained" onClick={connectMetaMask}>
          Connect MetaMask
        </Button>
      ) : (
        <nav>
          <h2>Chain</h2>
          <span>{wallet.chainName}</span>
        </nav>
      )}
    </>
  );
};

export default Navigation;
