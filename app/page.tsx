'use client';

import Navigation from '../components/Navigation';
import Wallet from '../components/Wallet';
import Transaction from '../components/Transaction';
import { MetaMaskContextProvider } from '../hooks/useMetaMask';
import './reset.sass';
import './styles.sass';

const page = () => {
  return (
    <MetaMaskContextProvider>
      <Navigation />
      <main>
        <Wallet />
        <Transaction />
      </main>
    </MetaMaskContextProvider>
  );
};

export default page;
