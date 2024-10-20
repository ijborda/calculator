import { TAX_BRACKETS } from '@/constants/sahod-calculator/tax-brackets';
import { formatPhpCurrency } from '@/utils/currency';

export class TaxCalculator {
  // Annual taxable income
  public taxableIncome: number;

  // Tax bracket in use
  private taxBracket: (typeof TAX_BRACKETS)[0];

  // Portion of taxable income covered by previous bracket
  private excessOver: number;

  // Portion of taxable income covered by current bracket
  private excess: number;

  // Outputs
  private _taxableIncomeExplanation: string;
  private _incomeTax: number;
  private _incomeTaxExplanation: string;
  private _netIncome: number;
  private _netIncomeExplanation: string;

  constructor(taxableIncome: number) {
    this.taxableIncome = taxableIncome;
    this.taxBracket = this.getTaxBracket();
    this.excessOver = this.taxBracket.bounds.inclusiveLower - 1;
    this.excess = taxableIncome - this.excessOver;
    this._taxableIncomeExplanation = this.getTaxableIncomeExplanation();
    this._incomeTax = this.getIncomeTax();
    this._incomeTaxExplanation = this.getIncomeTaxExplanation();
    this._netIncome = this.getNetIncome();
    this._netIncomeExplanation = this.getNetIncomeExaplanation();
  }

  public get taxableIncomeExplanation() {
    return this._taxableIncomeExplanation;
  }

  public get incomeTax() {
    return this._incomeTax;
  }

  public get incomeTaxExplanation() {
    return this._incomeTaxExplanation;
  }

  public get netIncome() {
    return this._netIncome;
  }

  public get netIncomeExplanation() {
    return this._netIncomeExplanation;
  }

  private getTaxBracket = () => {
    const taxBracket = TAX_BRACKETS.find(
      ({ bounds: { inclusiveLower, inclusiveUpper } }) =>
        this.taxableIncome >= inclusiveLower &&
        this.taxableIncome <= inclusiveUpper
    );
    if (!taxBracket) throw new Error('Cannot find tax rate.');
    return taxBracket;
  };

  private getfmtValues = () => {
    const { bounds, fixedTax, excessTaxRate } = this.taxBracket;
    const fmtTaxableIncome = formatPhpCurrency(this.taxableIncome);
    const fmtExcessOver = formatPhpCurrency(this.excessOver);
    const fmtUpperBound = formatPhpCurrency(bounds.inclusiveUpper);
    const fmtFixedTax = formatPhpCurrency(fixedTax);
    const fmtExcessTaxRate = `${excessTaxRate * 100}%`;
    const fmtExcess = formatPhpCurrency(this.excess);
    const fmtIncomeTax = formatPhpCurrency(this._incomeTax);
    const fmtVariableTax = formatPhpCurrency(this.excess * excessTaxRate);
    const fmtNetIncome = formatPhpCurrency(this._netIncome);
    return {
      fmtTaxableIncome,
      fmtExcessOver,
      fmtUpperBound,
      fmtFixedTax,
      fmtExcessTaxRate,
      fmtExcess,
      fmtIncomeTax,
      fmtVariableTax,
      fmtNetIncome,
    };
  };

  private getTaxableIncomeExplanation() {
    const { fmtTaxableIncome } = this.getfmtValues();
    return `
      Your taxable income is ${fmtTaxableIncome} which is what you entered.
      This is your gross pay after deducting all government mandated benefits
      such as SSS, Pag-IBIG, and PhilHealth. These government mandated benefits are non-taxable.
    `;
  }

  private getIncomeTax() {
    const { fixedTax, excessTaxRate } = this.taxBracket;
    const tax = fixedTax + this.excess * excessTaxRate;
    return tax;
  }

  private getIncomeTaxExplanation() {
    const { id } = this.taxBracket;
    const {
      fmtTaxableIncome,
      fmtExcessOver,
      fmtUpperBound,
      fmtFixedTax,
      fmtExcessTaxRate,
      fmtExcess,
      fmtIncomeTax,
      fmtVariableTax,
    } = this.getfmtValues();

    switch (this.taxBracket.id) {
      case '1st':
        return `
          Your annual taxable income is ${fmtTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income of ${fmtUpperBound} or below.
          <br/>
          For this bracket, you are tax exempt so your income tax is ${fmtIncomeTax}.`;
      case '2nd':
        return `
          Your annual taxable income is ${fmtTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}
          but not over ${fmtUpperBound}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your total tax is ${fmtExcess} * ${fmtIncomeTax} = ${fmtIncomeTax}.`;
      case '6th':
        return `
          Your annual taxable income is ${fmtTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtFixedTax} + ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your total tax is ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate})
          which is equal to ${fmtFixedTax} + ${fmtVariableTax} = ${fmtIncomeTax}.`;
      default:
        return `
          Your annual taxable income is ${fmtTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}
          but not over ${fmtUpperBound}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtFixedTax} + ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your total tax is ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate})
          which is equal to ${fmtFixedTax} + ${fmtVariableTax} = ${fmtIncomeTax}.`;
    }
  }

  private getNetIncome() {
    return this.taxableIncome - this._incomeTax;
  }

  private getNetIncomeExaplanation() {
    const { fmtTaxableIncome, fmtNetIncome, fmtIncomeTax } =
      this.getfmtValues();
    return `
      Your taxable income is ${fmtTaxableIncome} and your income tax is ${fmtIncomeTax}.
      Then your net income is ${fmtTaxableIncome} - ${fmtIncomeTax} = ${fmtNetIncome}.
    `;
  }
}
