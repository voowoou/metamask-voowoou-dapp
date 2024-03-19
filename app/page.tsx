'use client';

import { useEffect } from 'react';
import Network from './components/Network';
import Wallet from './components/Wallet';
import Transaction from './components/Transaction';
import './page.css';

const page = () => {
  let injectedProvider = false; // Наличие/отсутствие провайдера

  if (typeof window.ethereum !== 'undefined') {
    injectedProvider = true;
    console.log(window.ethereum);
  }

  const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false; // Проверка наличия Metamask в качестве провайдера

  return (
    <div className="App">
      <h2>Injected Provider {injectedProvider ? 'DOES' : 'DOES NOT'} Exist</h2>
      {isMetaMask && <button>Connect MetaMask</button>}
    </div>
  );
};

export default page;
