import { Button, Input } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMetaMask } from '../hooks/useMetaMask';
import { useState } from 'react';

interface InputFields {
  to: string;
  value: string;
}

interface transactionParams {
  from: string;
  to: string;
  value: string;
}

const Transaction = () => {
  const { wallet } = useMetaMask();
  const maxValue = parseInt(wallet.balance);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      to: '',
      value: '',
    },
  });
  const onSubmit: SubmitHandler<InputFields> = data => {
    const transactionParams: transactionParams = {
      from: wallet.accounts[0],
      to: data.to,
      value: data.value,
    };
  };

  return (
    <section>
      <h2>Send</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>To</h3>
          <Controller
            name="to"
            control={control}
            rules={{
              required: "Recipient's adress is required",
              pattern: {
                value: /^0x[0-9,a-f,A-F]{40}$/,
                message: 'Please use hexadecimal format',
              },
            }}
            render={({ field }) => (
              <>
                <Input {...field} type="text" placeholder="Recipient's address" />
                {errors.to && <span>{errors.to.message}</span>}
              </>
            )}
          />
        </div>
        <div>
          <h3>Amount</h3>
          <Controller
            name="value"
            control={control}
            rules={{
              required: 'Amount is required',
              max: maxValue,
              min: 0,
            }}
            render={({ field }) => (
              <>
                <Input {...field} type="number" placeholder="0.00" />
                {errors.value && <span>{errors.value.message}</span>}
              </>
            )}
          />
        </div>
        <Button variant="contained" type="submit">
          SEND
        </Button>
      </form>
    </section>
  );
};

export default Transaction;
