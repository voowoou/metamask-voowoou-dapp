'use client';

import './page.css';
import Navigation from '../components/Navagation/Navigation';
import { useSDK, MetaMaskProvider } from '@metamask/sdk-react';

const page = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect: () => Promise<void> = async () => {
    try {
      await sdk?.connect();
    } catch (error) {
      console.log('Failed to find account ' + error);
    }
  };

  return <Navigation connect={connect} connected={connected} />;
};

export default page;
