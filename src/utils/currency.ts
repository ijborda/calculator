import BigNumber from 'bignumber.js';

export const formatPhpCurrency = (
  amount: BigNumber.Value | null | undefined
) => {
  const normalizedAmount = new BigNumber(amount ?? 0).toFixed(
    2,
    BigNumber.ROUND_HALF_UP
  );
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(Number(normalizedAmount));
};
