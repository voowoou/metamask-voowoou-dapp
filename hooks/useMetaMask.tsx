import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { formatBalance } from '../lib/utils';

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
}

const disconnectedState: WalletState = {
  accounts: [],
  balance: '',
  chainName: '',
};

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData);

const MetaMaskContextProvider = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const clearError = () => setErrorMessage('');

  const [wallet, setWallet] = useState(disconnectedState);

  const _updateWallet = useCallback(async (providedAccounts?: any) => {
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
    const [balance, setBalance] = useState('0.00');
    const rawBalance = await window.ethereum?.request({
      method: 'eth_getBalance',
      params: [accounts[0], 'latest'],
    });
    if (typeof rawBalance === 'string') {
      setBalance(formatBalance(rawBalance));
    }

    /*
      Получаем название сети, в которой находится пользователь.
      Если запрос возвращает ожидаемую строку, то с помощью getChainName
      возвращаем название сети, соответствующее ее chainId.
    */
    const [chainName, setChainName] = useState('');
    const getChainName = (chainId: string): string => {
      // switch...case для определения названия
      switch (chainId) {
        case '0x1':
          return 'ETH main';
        case '0x38':
          return 'BNB';
        default:
          return 'Cannot recognize chain ID';
      }
    };
    const chainId = await window.ethereum?.request({
      // Асинхронный запрос для получения ID
      method: 'eth_chainId',
    });
    if (typeof chainId === 'string') {
      setChainName(getChainName(chainId));
    }

    setWallet({ accounts, balance, chainName });
  }, []);
};
