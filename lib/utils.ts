import { BigNumber } from 'bignumber.js'; // Потому что JS не очень любит большие числа

/*
  Получаем Wei и форматируем в обычное число (в стейте в useMetaMask() оно храниться в виде строки).
*/
export const formatBalance = (rawBalance: string): string => {
  const balanceBN = new BigNumber(rawBalance); // Создаём объект BigNumber
  const balanceETH = balanceBN.dividedBy(new BigNumber('10').exponentiatedBy(18)); // Делим на вновь созданное BN, равное 10^18
  const balance = balanceETH.toFixed(2); // Приводим к числу с двумя знаками после запятой

  return balance;
};

/*
  formatChainName() используется для удобного представления активной сети при рендеринге UI компонентов.
*/
export const formatChainName = (chainId: string): string => {
  switch (chainId) {
    case '0x1':
      return 'ETH main';
    case '0x38':
      return 'BNB';
    default:
      return 'Cannot recognize chain ID';
  }
};

export const numToHex = (num: number): string => {
  const valueBN = new BigNumber(num); // Создаём объект BigNumber
  const valueWei = valueBN.multipliedBy(new BigNumber('10').exponentiatedBy(18)); // Представляем число в формате Wei
  const valueHex = '0x' + valueWei; // Добавляем 0x, получая шестнадцатеричное значение

  return valueHex;
};
