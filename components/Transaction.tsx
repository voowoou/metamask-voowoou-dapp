import { Button, Snackbar } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useMetaMask } from '../hooks/useMetaMask';
import { useState } from 'react';
import { numToHex } from '../lib/utils';
import styles from './Transaction.module.sass';

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
  const sendTransaction = async (params: transactionParams) => {
    try {
      const hashResponse = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [params],
      });
      if (hashResponse) {
        setTimeout(() => {
          updateWalletAfterTransaction();
        }, 15000);
      }
    } catch (err: any) {
      if (err) {
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
    sendTransaction(transactionParams);
    setSnackbarOpen(true);
  };

  return (
    <section className={styles.section}>
      {wallet.accounts.length > 0 && (
        <div>
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
                    <input
                      {...field}
                      type="text"
                      placeholder="Recipient's address"
                      className={styles.input}
                    />
                    {errors.to && <span className={styles.formError}>{errors.to.message}</span>}
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
                    <input
                      {...field}
                      type="number"
                      min="0"
                      max={maxValue}
                      step={0.00001}
                      placeholder="0.00000"
                      className={styles.input}
                    />
                    {errors.value && (
                      <span className={styles.formError}>{errors.value.message}</span>
                    )}
                  </>
                )}
              />
            </div>
            {isValid && (
              <Button className={styles.Button} fullWidth variant="contained" type="submit">
                SEND
              </Button>
            )}
          </form>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            message="Your transaction has been sent. Due to the specifics of transaction processing, 
            we will update your balance in 15 seconds. If this did not happen, please refresh this page."
            onClose={handleSnackbarClose}
          />
        </div>
      )}
    </section>
  );
};

export default Transaction;
