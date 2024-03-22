import Button from '@mui/material/Button';
import { useSDK } from '@metamask/sdk-react';
import { useEffect, useState } from 'react';

const Navigation = ({}) => {
  const { sdk, connected, chainId, account } = useSDK();
  const [chainName, setChainName] = useState('');

  const connect: () => Promise<void> = async () => {
    try {
      await sdk?.connect();
    } catch (error) {
      console.log('Failed to find account ' + error);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  const getChainName = (chainId: string): void => {
    switch (chainId) {
      case '0x1':
        setChainName('ETH main');
        break;
      case '0x38':
        setChainName('BNB');
        break;
      default:
        setChainName('Cannot recognize chain ID');
        break;
    }
  };

  useEffect(() => {
    if (chainId) {
      getChainName(chainId);
    }
  }, [chainId]);

  return (
    <nav>
      <h2>Chain</h2>
      {connected ? (
        <div>
          <div>
            <span>{chainName}</span>
          </div>
          <Button variant="contained" onClick={disconnect}>
            Disconnect MetaMask
          </Button>
        </div>
      ) : (
        <Button variant="contained" onClick={connect}>
          Connect MetaMask
        </Button>
      )}
    </nav>
  );
};

export default Navigation;
