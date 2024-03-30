import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import styles from './Wallet.module.sass';

const Wallet = () => {
  const { wallet } = useMetaMask();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.accounts[0]).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <section className={styles.section}>
      {wallet.accounts.length > 0 && (
        <div>
          <h2>Wallet</h2>
          <div>
            <h3>Balance</h3>
            <div className={styles.balance}>
              <span className={styles.balanceValue}>{wallet.balance}</span>
              <span className={styles.chainName}>{wallet.chainName}</span>
            </div>
          </div>
          <div>
            <h3>Address</h3>
            <div className={styles.address}>
              <span className={styles.addressValue}>{wallet.accounts[0]}</span>
              <Button
                className={styles.Button}
                variant="contained"
                disableRipple
                disableElevation
                onClick={handleCopyAddress}
              >
                COPY
              </Button>
            </div>
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            message="Address copied to clipboard"
            onClose={handleSnackbarClose}
          />
        </div>
      )}
    </section>
  );
};

export default Wallet;
