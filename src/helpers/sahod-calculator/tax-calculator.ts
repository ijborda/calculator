import { PAYROLL_PERIOD } from '@/constants/sahod-calculator/payroll-period';
import { TAX_BRACKETS } from '@/constants/sahod-calculator/tax-brackets';
import { formatPhpCurrency } from '@/utils/currency';

export class TaxCalculator {
  // Annual taxable income
  public annualTaxableIncome: number;

  // Taxable income in one payroll period
  private taxableIncome: number;

  // PayrollPeriod
  private payrollPeriod: PAYROLL_PERIOD;

  // Tax bracket in use
  private taxBracket: (typeof TAX_BRACKETS)[0];

  // Portion of taxable income covered by previous bracket
  private excessOver: number;

  // Portion of taxable income covered by current bracket
  private excess: number;

  // Outputs
  private _annualTaxableIncomeExplanation: string;
  private _annualIncomeTax: number;
  private _annualIncomeTaxExplanation: string;
  private _annualNetIncome: number;
  private _annualNetIncomeExplanation: string;

  constructor(taxableIncome: number, payrollPeriod = PAYROLL_PERIOD.ANNUAL) {
    this.taxableIncome = taxableIncome;
    this.payrollPeriod = payrollPeriod;
    this.annualTaxableIncome = this.taxableIncome * this.payrollPeriod;
    this.taxBracket = this.getTaxBracket();
    this.excessOver = this.taxBracket.bounds.inclusiveLower - 1;
    this.excess = this.annualTaxableIncome - this.excessOver;
    this._annualTaxableIncomeExplanation =
      this.getannualTaxableIncomeExplanation();
    this._annualIncomeTax = this.getAnnualIncomeTax();
    this._annualIncomeTaxExplanation = this.getAnnualIncomeTaxExplanation();
    this._annualNetIncome = this.getAnnualNetIncome();
    this._annualNetIncomeExplanation = this.getAnnualNetIncomeExaplanation();
  }

  public get annualTaxableIncomeExplanation() {
    return this._annualTaxableIncomeExplanation;
  }

  public get annualIncomeTax() {
    return this._annualIncomeTax;
  }

  public get annualIncomeTaxExplanation() {
    return this._annualIncomeTaxExplanation;
  }

  public get annualNetIncome() {
    return this._annualNetIncome;
  }

  public get annualNetIncomeExplanation() {
    return this._annualNetIncomeExplanation;
  }

  private getTaxBracket = () => {
    const taxBracket = TAX_BRACKETS.find(
      ({ bounds: { inclusiveLower, inclusiveUpper } }) =>
        this.annualTaxableIncome >= inclusiveLower &&
        this.annualTaxableIncome <= inclusiveUpper
    );
    if (!taxBracket) throw new Error('Cannot find tax rate.');
    return taxBracket;
  };

  private getfmtValues = () => {
    const { bounds, fixedTax, excessTaxRate } = this.taxBracket;
    const fmtTaxableIncome = formatPhpCurrency(this.taxableIncome);
    const fmtannualTaxableIncome = formatPhpCurrency(this.annualTaxableIncome);
    const fmtExcessOver = formatPhpCurrency(this.excessOver);
    const fmtUpperBound = formatPhpCurrency(bounds.inclusiveUpper);
    const fmtFixedTax = formatPhpCurrency(fixedTax);
    const fmtExcessTaxRate = `${excessTaxRate * 100}%`;
    const fmtExcess = formatPhpCurrency(this.excess);
    const fmtIncomeTax = formatPhpCurrency(this._annualIncomeTax);
    const fmtVariableTax = formatPhpCurrency(this.excess * excessTaxRate);
    const fmtNetIncome = formatPhpCurrency(this._annualNetIncome);
    return {
      fmtTaxableIncome,
      fmtannualTaxableIncome,
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

  private getannualTaxableIncomeExplanation() {
    const { fmtannualTaxableIncome, fmtTaxableIncome } = this.getfmtValues();
    return `
      Your annual taxable income is ${fmtannualTaxableIncome}.
      This is ${fmtTaxableIncome}
      multiplied by ${this.payrollPeriod} (based on the entered payroll period).
      So, ${fmtTaxableIncome} * ${this.payrollPeriod} = ${fmtannualTaxableIncome}.
      <br/>
      This is your annual annual salary subtracted by all deductions (such as government mandated benefits
      like SSS, Pag-IBIG, and PhilHealth). These government mandated benefits are non-taxable.
    `;
  }

  private getAnnualIncomeTax() {
    const { fixedTax, excessTaxRate } = this.taxBracket;
    const tax = fixedTax + this.excess * excessTaxRate;
    return tax;
  }

  private getAnnualIncomeTaxExplanation() {
    const { id } = this.taxBracket;
    const {
      fmtannualTaxableIncome,
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
          Your annual taxable income is ${fmtannualTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income of ${fmtUpperBound} or below.
          <br/>
          For this bracket, you are tax exempt so your income tax is ${fmtIncomeTax}.`;
      case '2nd':
        return `
          Your annual taxable income is ${fmtannualTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}
          but not over ${fmtUpperBound}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtannualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your annual tax is ${fmtExcess} * ${fmtIncomeTax} = ${fmtIncomeTax}.`;
      case '6th':
        return `
          Your annual taxable income is ${fmtannualTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtFixedTax} + ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtannualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your annual tax is ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate})
          which is equal to ${fmtFixedTax} + ${fmtVariableTax} = ${fmtIncomeTax}.`;
      default:
        return `
          Your annual taxable income is ${fmtannualTaxableIncome}.
          Per the income tax rate published by the BIR,
          you fall on the ${id} tax bracket
          which covers annual income over ${fmtExcessOver}
          but not over ${fmtUpperBound}.
          <br/>
          For this bracket, the tax is calculated as: ${fmtFixedTax} + ${fmtExcessTaxRate} of the excess over ${fmtExcessOver}.
          <br/>
          Your excess is ${fmtannualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          So, your annual tax is ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate})
          which is equal to ${fmtFixedTax} + ${fmtVariableTax} = ${fmtIncomeTax}.`;
    }
  }

  private getAnnualNetIncome() {
    return this.annualTaxableIncome - this._annualIncomeTax;
  }

  private getAnnualNetIncomeExaplanation() {
    const { fmtannualTaxableIncome, fmtNetIncome, fmtIncomeTax } =
      this.getfmtValues();
    return `
      Your taxable income is ${fmtannualTaxableIncome} and your income tax is ${fmtIncomeTax}.
      Then your net income is ${fmtannualTaxableIncome} - ${fmtIncomeTax} = ${fmtNetIncome}.
    `;
  }
}
