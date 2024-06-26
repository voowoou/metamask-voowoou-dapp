import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { formatBalance, formatChainName } from '../lib/utils';

interface WalletState {
  accounts: any[];
  balance: string;
  chainName: string;
}

interface MetaMaskContextData {
  wallet: WalletState;
  hasProvider: boolean | null;
  error: boolean;
  errorMessage: string;
  isConnecting: boolean;
  connectMetaMask: () => void;
  clearError: () => void;
  updateWalletAfterTransaction: () => void;
}

const disconnectedState: WalletState = {
  accounts: [],
  balance: '',
  chainName: '',
};

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData);

export const MetaMaskContextProvider = ({ children }: PropsWithChildren) => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const clearError = () => setErrorMessage('');

  const [wallet, setWallet] = useState(disconnectedState);

  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    /*
      Получаем пользовательский счёт и разрешение на некоторые операции.
      Если был передан счёт, то используем его. В ином случае нужно сделать запрос.
    */
    const accounts =
      providedAccounts || (await window.ethereum?.request({ method: 'eth_accounts' }));

    if (accounts.length === 0) {
      // Если счетов нет, то пользователь не подключен к MetaMask
      setWallet(disconnectedState);
      return;
    }

    /*
      Получаем баланс счёта.
      Если запрос возвращает ожидаемую строку, то форматируем строку в обычное число.
    */
    const rawBalance = await window.ethereum?.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });

    const balance = typeof rawBalance === 'string' ? formatBalance(rawBalance) : '0.00';

    /*
      Получаем название сети, в которой находится пользователь.
      Если запрос возвращает ожидаемую строку, то с помощью getChainName
      возвращаем название сети, соответствующее ее chainId.
    */
    const chainId = await window.ethereum?.request({
      method: 'eth_chainId',
    });

    const chainName = typeof chainId === 'string' ? formatChainName(chainId) : '';

    // Устанавливаем полученные значения в стейт wallet
    setWallet({ accounts, balance, chainName });
  }, []);

  /* 
    Блок кода внутри useEffect() проверяет наличие MetaMask (т.к. тот добавляет свой провайдер).
    При налиичии провайдера могут запуститься updateWallet или updateWalletAndAccounts (хэндлеры).
    В конце хука возвращается функция очистки, удаляющая хэндлеров, при размонтировании провайдера
    MetaMaskProvider.
  */
  // Функция срабатывает при изменении сети пользователем или при первом рендеринге информации о кошельке.
  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet]);

  //Функция срабатывает, когда пользователь меняет счёт без перехода в другую сеть.
  const updateWallet = useCallback((accounts: any) => _updateWallet(accounts), [_updateWallet]);

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        updateWalletAndAccounts();
        window.ethereum?.on('accountsChanged', updateWallet);
        window.ethereum?.on('chainChanged', updateWalletAndAccounts);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet);
      window.ethereum?.removeListener('chainChanged', updateWalletAndAccounts);
    };
  }, [updateWallet, updateWalletAndAccounts]);

  /*
    Подключение к MetaMask для доступа к информации о счетах пользователя.
  */
  const connectMetaMask = async () => {
    setIsConnecting(true);

    try {
      const accounts = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      });
      clearError();
      updateWallet(accounts);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setIsConnecting(false);
  };

  /*
    Функция запрашивает обновление баланса через 15 секунд после совершения транзакции.
    На самом деле, можно добавить event listener'а из библиотеки ethers, который будет
    "слушать" состояние транзакции.
    Без этой логики баланс после транзакции не обновится, т.к. у последней какое-то время
    имеется состояние pending.
  */
  const updateWalletAfterTransaction = useCallback(() => {
    _updateWallet();
  }, [_updateWallet]);

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectMetaMask,
        clearError,
        updateWalletAfterTransaction,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

/*
  Пишем сам хук, используя useContext() для стейт-менеджмента.
*/
export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskContextProvider');
  }
  return context;
};
