'use client';

import './page.css';
import Navigation from '../components/Navigation';
import Wallet from '../components/Wallet';
import Transaction from '../components/Transaction';
import { MetaMaskProvider } from '@metamask/sdk-react';

const page = () => {
  const host = typeof window !== 'undefined' ? window.location.href : 'defaultHost'; // Чтобы window передавался в dApp метадату только на стороне клиента

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'MetaMask Wallet',
          url: host,
        },
      }}
    >
      <Navigation />
      <main>
        <Wallet />
        <Transaction />
      </main>
    </MetaMaskProvider>
  );
};

export default page;
