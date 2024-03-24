export const formatBalance = (rawBalance: string | undefined) => {
  if (rawBalance === undefined) {
    return 0.0;
  }
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatAddress = (addr: string | undefined) => {
  if (addr === undefined) {
    return 'No Address';
  }
  return addr;
};
