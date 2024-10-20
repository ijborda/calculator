import { TAX_RATES } from '@/constants/tax-rate';

export const computeTax = (annualTaxableIncome: number) => {
  const taxRate = TAX_RATES.find(
    ({ inclusiveBounds }) =>
      annualTaxableIncome >= inclusiveBounds[0] &&
      annualTaxableIncome <= inclusiveBounds[1]
  );
  if (!taxRate) throw new Error('Cannot find tax rate.');

  const { fixedTax, inclusiveBounds, excessTaxRate } = taxRate;
  const excess = annualTaxableIncome - (inclusiveBounds[0] - 1);
  const tax = fixedTax + excess * excessTaxRate;
  const netPay = annualTaxableIncome - tax;

  return {
    tax,
    netPay,
  };
};
