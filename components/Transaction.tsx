import { Button } from '@mui/material';
import { useMetaMask } from '../hooks/useMetaMask';
import { useState } from 'react';

interface transactionParamsInterface {
  to: string;
  from: string;
  value: string;
}

const Transaction = () => {
  const { wallet } = useMetaMask();
  const [toAddress, setToAddress] = useState<string>('');
  const [value, setValue] = useState<number>(null);

  const handleToAddressChange = () => {};

  const handleAmountChange = () => {};

  const transactionParams: transactionParamsInterface = {
    to: toAddress,
    from: wallet.accounts[0],
    value: value.toString(),
  };

  const sendTransaction;

  return (
    <section>
      <h2>Send</h2>
      <div>
        <div>
          <h3>To</h3>
          <input type="text" onChange={handleToAddressChange}></input>
        </div>
        <div>
          <h3>Amount</h3>
          <input type="number" onChange={handleAmountChange}></input>
        </div>
        <Button variant="contained" onClick={sendTransaction}>
          SEND
        </Button>
      </div>
    </section>
  );
};

export default Transaction;
