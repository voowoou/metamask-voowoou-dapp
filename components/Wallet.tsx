import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask';

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
    <>
      {wallet.accounts.length > 0 && (
        <section>
          <h2>Wallet</h2>
          <div>
            <h3>Balance</h3>
            <div>
              <span>{wallet.balance}</span>
              <span>{wallet.chainName}</span>
            </div>
          </div>
          <div>
            <h3>Adress</h3>
            <div>
              <span>{wallet.accounts[0]}</span>
              <Button variant="contained" onClick={handleCopyAddress}>
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
        </section>
      )}
    </>
  );
};

export default Wallet;
