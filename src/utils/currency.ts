export const formatPhpCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};
