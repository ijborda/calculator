import { TAX_RATES } from '@/constants/tax-rate';
import { formatPhpCurrency } from '@/utils/currency';

export const computeTax = (annualTaxableIncome: number) => {
  const taxRate = TAX_RATES.find(
    ({ inclusiveBounds }) =>
      annualTaxableIncome >= inclusiveBounds[0] &&
      annualTaxableIncome <= inclusiveBounds[1]
  );
  if (!taxRate) throw new Error('Cannot find tax rate.');

  const { fixedTax, inclusiveBounds, excessTaxRate, id } = taxRate;
  const excess = annualTaxableIncome - (inclusiveBounds[0] - 1);
  const tax = fixedTax + excess * excessTaxRate;
  const netPay = annualTaxableIncome - tax;
  const explanation = `Your annual taxable income is ${formatPhpCurrency(
    annualTaxableIncome
  )}. Per the income tax rate published by the BIR (https://www.bir.gov.ph/income-tax), you fall on the ${id} tax bracket which covers annual income over ${formatPhpCurrency(
    inclusiveBounds[0] - 1
  )} but not over ${formatPhpCurrency(
    inclusiveBounds[1]
  )}. This means your tax is ${formatPhpCurrency(fixedTax)} + ${
    excessTaxRate * 100
  }% of the excess over ${formatPhpCurrency(
    inclusiveBounds[0] - 1
  )}. The excess is ${formatPhpCurrency(
    annualTaxableIncome
  )} - ${formatPhpCurrency(inclusiveBounds[0] - 1)} = ${formatPhpCurrency(
    excess
  )}. So, your total tax is ${formatPhpCurrency(
    fixedTax
  )} + (${formatPhpCurrency(excess)} * ${excessTaxRate}) = ${formatPhpCurrency(
    fixedTax
  )} + ${formatPhpCurrency(excess * excessTaxRate)} = ${formatPhpCurrency(
    tax
  )}.`;

  return {
    tax,
    netPay,
    explanation,
  };
};
