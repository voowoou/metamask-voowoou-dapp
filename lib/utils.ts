export const formatBalance = (rawBalance: string): string => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

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
