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
  const previousBracketUpperBound = inclusiveBounds[0] - 1;
  const excess = annualTaxableIncome - previousBracketUpperBound;
  const tax = fixedTax + excess * excessTaxRate;
  const netPay = annualTaxableIncome - tax;

  //
  const formattedTaxableIncome = formatPhpCurrency(annualTaxableIncome);
  const formattedPreviousBracketUpperBound = formatPhpCurrency(
    previousBracketUpperBound
  );
  const formattedUpperBound = formatPhpCurrency(inclusiveBounds[1]);
  const formattedFixedTax = formatPhpCurrency(fixedTax);
  const formattedExcessTaxRate = `${excessTaxRate * 100}%`;
  const formattedExcess = formatPhpCurrency(excess);
  const formattedTax = formatPhpCurrency(tax);
  const formattedVariableTax = formatPhpCurrency(excess * excessTaxRate);

  let explanation = '';
  switch (id) {
    case '1st':
      explanation = `
        Your annual taxable income is ${formattedTaxableIncome}.
        Per the income tax rate published by the BIR (https://www.bir.gov.ph/income-tax),
        you fall on the ${id} tax bracket
        which covers annual income below ${formattedUpperBound}.
        \n\n
        For this bracket, you are tax exempt so your income tax is ${formattedTax}.`;
      break;
    case '2nd':
      explanation = `
        Your annual taxable income is ${formattedTaxableIncome}.
        Per the income tax rate published by the BIR (https://www.bir.gov.ph/income-tax),
        you fall on the ${id} tax bracket
        which covers annual income over ${formattedPreviousBracketUpperBound}
        but not over ${formattedUpperBound}.
        \n\n
        For this bracket, the tax is calculated as: ${formattedExcessTaxRate} of the excess over ${formattedPreviousBracketUpperBound}.
        \n\n\n
        Your excess is ${formattedTaxableIncome} - ${formattedPreviousBracketUpperBound} = ${formattedExcess}.
        So, your total tax is ${formattedExcess} * ${excessTaxRate} = ${formattedTax}.`;
      break;
    case '6th':
      explanation = `
        Your annual taxable income is ${formattedTaxableIncome}.
        Per the income tax rate published by the BIR (https://www.bir.gov.ph/income-tax),
        you fall on the ${id} tax bracket
        which covers annual income over ${formattedPreviousBracketUpperBound}.
        \n\n
        For this bracket, the tax is calculated as: ${formattedFixedTax} + ${formattedExcessTaxRate} of the excess over ${formattedPreviousBracketUpperBound}.
        \n\n\n
        Your excess is ${formattedTaxableIncome} - ${formattedPreviousBracketUpperBound} = ${formattedExcess}.
        So, your total tax is ${formattedFixedTax} + (${formattedExcess} * ${excessTaxRate})
        which is equal to ${formattedFixedTax} + ${formattedVariableTax} = ${formattedTax}.`;
      break;
    default:
      explanation = `
        Your annual taxable income is ${formattedTaxableIncome}.
        Per the income tax rate published by the BIR (https://www.bir.gov.ph/income-tax),
        you fall on the ${id} tax bracket
        which covers annual income over ${formattedPreviousBracketUpperBound}
        but not over ${formattedUpperBound}.
        \n\n
        For this bracket, the tax is calculated as: ${formattedFixedTax} + ${formattedExcessTaxRate} of the excess over ${formattedPreviousBracketUpperBound}.
        \n\n\n
        Your excess is ${formattedTaxableIncome} - ${formattedPreviousBracketUpperBound} = ${formattedExcess}.
        So, your total tax is ${formattedFixedTax} + (${formattedExcess} * ${excessTaxRate})
        which is equal to ${formattedFixedTax} + ${formattedVariableTax} = ${formattedTax}.`;
  }

  return {
    tax,
    netPay,
    explanation,
  };
};
