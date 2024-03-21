'use client'; // Я просто хотел бы спокойно получить доступ к window и использованию useEffect()... Нормальный SSR будет в следующий раз...

import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { formatBalance, formatChainAsNum } from '../lib/utils';
import './page.css';

const page = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = {
    accounts: [],
    balance: '',
    chainId: '',
  };
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState); // Если accounts.length = 0, то пользователь отключился
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet(wallet => ({ ...wallet, chainId }));
    };

    // Функция обнаруживающая провайдер и меняющая флаг наличия провайдера в клиенте
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setHasProvider(Boolean(provider)); // Преобразуем provider в булево значение

      // Если провайдер есть, то
      if (provider) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        refreshAccounts(accounts);
        window.ethereum.on('accountsChanged', refreshAccounts); // Обработчик события в случае изменения активного счета в Metamask
      }
    };

    getProvider();

    // Очистка обработчика событий
    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts);
      window.ethereum?.removeListener('chainChanged', refreshChain);
    };
  }, []);

  // Функция обновляет стейт после получения массива со счетами
  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      }),
    );
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId',
    });
    setWallet({ accounts, balance, chainId });
  };

  // Хэндлер для запроса счетов пользователя
  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    updateWallet(accounts);
  };

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
        <button onClick={handleConnect}>Connect MetaMask</button>
      )}

      {wallet.accounts.length > 0 && (
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
      )}
    </div>
  );
};

export default page;
