'use client';

import './page.css';
import Navigation from '../components/Navigation';
import Wallet from '../components/Wallet';
import Transaction from '../components/Transaction';
import { MetaMaskContextProvider } from '../hooks/useMetaMask';

const page = () => {
  const host = typeof window !== 'undefined' ? window.location.href : 'defaultHost'; // Чтобы window передавался в dApp метадату только на стороне клиента

  return (
    <MetaMaskContextProvider>
      <Navigation />
      <main>
        {/* <Wallet /> */}
        {/* <Transaction /> */}
      </main>
    </MetaMaskContextProvider>
  );
};

export default page;
