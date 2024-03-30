import { Button, Link } from '@mui/material';
import { useMetaMask } from '../hooks/useMetaMask';
import styles from './Navigation.module.sass';

const Navigation = ({}) => {
  const { wallet, hasProvider, connectMetaMask } = useMetaMask();
  const isMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask; // Проверяем, установлено ли MetaMask Extension, избегая ошибки 'window is undefined'

  return (
    <nav className={styles.nav}>
      {!hasProvider ? (
        <Link href="https://metamask.io" target="_blank" className={styles.Link}>
          Install MetaMask
        </Link>
      ) : isMetaMask && wallet.accounts.length < 1 ? (
        <Button
          className={styles.Button}
          variant="contained"
          size="large"
          disableRipple
          disableElevation
          onClick={connectMetaMask}
        >
          Connect MetaMask
        </Button>
      ) : (
        <div className={styles.chain}>
          <h2>Chain</h2>
          <span className={styles.chainName}>{wallet.chainName}</span>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
