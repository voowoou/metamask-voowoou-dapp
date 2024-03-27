import { Button, Input, Snackbar } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMetaMask } from '../hooks/useMetaMask';
import { useState } from 'react';
import { numToHex } from '../lib/utils';

interface InputFields {
  // Типизируем то, что получит из инпута функция onSubmit (React Hook Form)
  to: string;
  value: string;
}

interface transactionParams {
  // Типизируем параметры, отправляющиеся в теле запроса
  from: string;
  to: string;
  value: string;
}

const Transaction = () => {
  const { wallet, updateWalletAfterTransaction } = useMetaMask();
  const maxValue = parseFloat(wallet.balance); // Ограничиваем максимальную сумму перевода балансом счёта
  const [isSent, setIsSent] = useState<boolean>(false); // Отправлен ли запрос
  const [error, setError] = useState<boolean>(false); // Возникла ли ошибка при отправке запроса
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /*
    Подключение useForm() из пакета React Hook Form.
    RHF позволит проще и быстрее управлять элементами формы из MUI, добавлять ограничения и обрабатывать ошибки ввода.
  */
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      to: '',
      value: '',
    },
  });

  /*
  connectMetaMask() принимает параметры запроса (отправителя, получателя, сумму перевода), обновляет стейты isSent и error.
  */
  const connectMetaMask = async (params: transactionParams) => {
    try {
      const hashResponse = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [params],
      });
      if (hashResponse) {
        setIsSent(true);
      }
    } catch (err: any) {
      if (err) {
        setError(true);
        console.log(err.message);
      }
    }
  };

  /*
  onSubmit() записывает данные из инпутов в переменную transactionParams, а также вызывает функцию на запрос транзакции.
  */
  const onSubmit: SubmitHandler<InputFields> = data => {
    const transactionParams: transactionParams = {
      from: wallet.accounts[0],
      to: data.to,
      value: numToHex(parseFloat(data.value)),
    };
    connectMetaMask(transactionParams);
    setSnackbarOpen(true);
    updateWalletAfterTransaction();
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
              max: {
                value: maxValue,
                message: `Amount should not exceed ${maxValue}`,
              },
              min: {
                value: 0,
                message: 'Amount should be more than 0',
              },
            }}
            render={({ field }) => (
              <>
                <Input {...field} type="number" placeholder="0.00000" />
                {errors.value && <span>{errors.value.message}</span>}
              </>
            )}
          />
        </div>
        {isValid && (
          <Button variant="contained" type="submit">
            SEND
          </Button>
        )}
      </form>
      <Snackbar
        open={isSent}
        autoHideDuration={6000}
        message="Your transaction has been sent. Due to the specifics of transaction processing, 
        we will update your balance in 15 seconds. If this did not happen, please refresh this page."
        onClose={handleSnackbarClose}
      />
    </section>
  );
};

export default Transaction;
