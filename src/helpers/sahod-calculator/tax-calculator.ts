import { TAX_BRACKETS } from '@/constants/sahod-calculator/tax-brackets';
import { SSS_BRACKETS } from '@/constants/sahod-calculator/sss-brackets';
import { formatPhpCurrency } from '@/utils/currency';

export class TaxCalculator {
  // Inputs
  private monthlyBasicIncome: number;

  // Monthly values
  public monthlySss: number;
  public monthlyPhilHealth: number;
  public monthlyPagIbig: number;
  public monthlyDeductions: number;
  public monthlyTaxableIncome: number;
  public monthlyIncomeTax: number;
  public monthlyTakeHomePay: number;

  // Annual values
  public annualGrossIncome: number;
  public annualDeductions: number;
  public annualTaxableIncome: number;

  // Tax bracket in use
  private taxBracket: (typeof TAX_BRACKETS)[0];

  // Portion of taxable income covered by previous bracket
  private excessOver: number;

  // Portion of taxable income covered by current bracket
  private excess: number;

  // Outputs
  private _monthlySssExplanation: string;
  private _monthlyPhilHealthExplanation: string;
  private _monthlyPagIbigExplanation: string;
  private _monthlyDeductionsExplanation: string;
  private _monthlyTaxableIncomeExplanation: string;
  private _monthlyIncomeTaxExplanation: string;
  private _monthlyTakeHomePayExplanation: string;
  private _annualGrossIncomeExplanation: string;
  private _annualDeductionsExplanation: string;
  private _annualIncomeTax: number;
  private _annualTaxableIncomeExplanation: string;
  private _annualIncomeTaxExplanation: string;
  private _annualNetIncome: number;
  private _annualNetIncomeExplanation: string;

  constructor(monthlyBasicIncome: number) {
    this.monthlyBasicIncome = Math.max(monthlyBasicIncome, 0);
    this.monthlySss = this.getMonthlySss();
    this.monthlyPhilHealth = this.getMonthlyPhilHealth();
    this.monthlyPagIbig = this.getMonthlyPagIbig();
    this.monthlyDeductions =
      this.monthlySss + this.monthlyPhilHealth + this.monthlyPagIbig;
    this.monthlyTaxableIncome = Math.max(
      this.monthlyBasicIncome - this.monthlyDeductions,
      0
    );

    this.annualGrossIncome = this.monthlyBasicIncome * 12;
    this.annualDeductions = this.monthlyDeductions * 12;
    this.annualTaxableIncome = this.monthlyTaxableIncome * 12;
    this.taxBracket = this.getTaxBracket();
    this.excessOver = this.taxBracket.bounds.inclusiveLower - 1;
    this.excess = this.annualTaxableIncome - this.excessOver;

    this._annualIncomeTax = this.getAnnualIncomeTax();
    this.monthlyIncomeTax = this._annualIncomeTax / 12;
    this.monthlyTakeHomePay = Math.max(
      this.monthlyBasicIncome - this.monthlyDeductions - this.monthlyIncomeTax,
      0
    );
    this._annualIncomeTaxExplanation = this.getAnnualIncomeTaxExplanation();
    this._annualNetIncome = this.getAnnualNetIncome();

    this._monthlySssExplanation = this.getMonthlySssExplanation();
    this._monthlyPhilHealthExplanation = this.getMonthlyPhilHealthExplanation();
    this._monthlyPagIbigExplanation = this.getMonthlyPagIbigExplanation();
    this._monthlyDeductionsExplanation = this.getMonthlyDeductionsExplanation();
    this._monthlyTaxableIncomeExplanation =
      this.getMonthlyTaxableIncomeExplanation();
    this._monthlyIncomeTaxExplanation = this.getMonthlyIncomeTaxExplanation();
    this._monthlyTakeHomePayExplanation = this.getMonthlyTakeHomePayExplanation();
    this._annualGrossIncomeExplanation = this.getAnnualGrossIncomeExplanation();
    this._annualDeductionsExplanation = this.getAnnualDeductionsExplanation();
    this._annualTaxableIncomeExplanation =
      this.getannualTaxableIncomeExplanation();
    this._annualNetIncomeExplanation = this.getAnnualNetIncomeExaplanation();
  }

  public get monthlySssExplanation() {
    return this._monthlySssExplanation;
  }

  public get monthlyPhilHealthExplanation() {
    return this._monthlyPhilHealthExplanation;
  }

  public get monthlyPagIbigExplanation() {
    return this._monthlyPagIbigExplanation;
  }

  public get monthlyDeductionsExplanation() {
    return this._monthlyDeductionsExplanation;
  }

  public get monthlyTaxableIncomeExplanation() {
    return this._monthlyTaxableIncomeExplanation;
  }

  public get monthlyIncomeTaxExplanation() {
    return this._monthlyIncomeTaxExplanation;
  }

  public get monthlyTakeHomePayExplanation() {
    return this._monthlyTakeHomePayExplanation;
  }

  public get annualGrossIncomeExplanation() {
    return this._annualGrossIncomeExplanation;
  }

  public get annualDeductionsExplanation() {
    return this._annualDeductionsExplanation;
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
    const fmtMonthlyBasicIncome = formatPhpCurrency(this.monthlyBasicIncome);
    const fmtMonthlySss = formatPhpCurrency(this.monthlySss);
    const fmtMonthlyPhilHealth = formatPhpCurrency(this.monthlyPhilHealth);
    const fmtMonthlyPagIbig = formatPhpCurrency(this.monthlyPagIbig);
    const fmtMonthlyDeductions = formatPhpCurrency(this.monthlyDeductions);
    const fmtMonthlyTaxableIncome = formatPhpCurrency(this.monthlyTaxableIncome);
    const fmtMonthlyIncomeTax = formatPhpCurrency(this.monthlyIncomeTax);
    const fmtMonthlyTakeHomePay = formatPhpCurrency(this.monthlyTakeHomePay);
    const fmtAnnualGrossIncome = formatPhpCurrency(this.annualGrossIncome);
    const fmtAnnualDeductions = formatPhpCurrency(this.annualDeductions);
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
      fmtMonthlyBasicIncome,
      fmtMonthlySss,
      fmtMonthlyPhilHealth,
      fmtMonthlyPagIbig,
      fmtMonthlyDeductions,
      fmtMonthlyTaxableIncome,
      fmtMonthlyIncomeTax,
      fmtMonthlyTakeHomePay,
      fmtAnnualGrossIncome,
      fmtAnnualDeductions,
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

  private getMonthlySss() {
    return this.getSssBracket().employeeTotal;
  }

  private getSssBracket() {
    const sssBracket = SSS_BRACKETS.find(
      ({ minSalary, maxSalary }) =>
        this.monthlyBasicIncome >= minSalary &&
        this.monthlyBasicIncome <= maxSalary
    );
    if (!sssBracket) throw new Error('Cannot find SSS bracket.');
    return sssBracket;
  }

  private getMonthlyPhilHealth() {
    // Employee share approximation: 2.5% of salary (half of 5% premium), floor 10k, cap 100k.
    const contributionBase = Math.min(Math.max(this.monthlyBasicIncome, 10_000), 100_000);
    return contributionBase * 0.025;
  }

  private getMonthlyPagIbig() {
    // Employee share: 2% up to a maximum monthly contribution of 100.
    const contributionBase = Math.min(this.monthlyBasicIncome, 10_000); // Cap at 10k for Pag-IBIG
    return contributionBase * 0.02;
  }

  private getMonthlySssExplanation() {
    const { minSalary, maxSalary, msc, employeeRegular, employeeMpf } =
      this.getSssBracket();
    const { fmtMonthlyBasicIncome, fmtMonthlySss } = this.getfmtValues();
    const fmtMinSalary = formatPhpCurrency(minSalary);
    const fmtMaxSalary = Number.isFinite(maxSalary)
      ? formatPhpCurrency(maxSalary)
      : 'and above';
    const fmtMsc = formatPhpCurrency(msc);
    const fmtEmployeeRegular = formatPhpCurrency(employeeRegular);
    const fmtEmployeeMpf = formatPhpCurrency(employeeMpf);
    return `
      Per the SSS bracket, you fall between ${fmtMinSalary} and ${fmtMaxSalary} with salary credit ${fmtMsc}.
      <br/>
      Based on this bracket, Monthly SSS employee contribution is computed as Employee Regular + Employee MPF.
      <br/>
      So, ${fmtEmployeeRegular} + ${fmtEmployeeMpf} = ${fmtMonthlySss} for monthly basic income ${fmtMonthlyBasicIncome}.
    `;
  }

  private getMonthlyPhilHealthExplanation() {
    const { fmtMonthlyBasicIncome, fmtMonthlyPhilHealth } = this.getfmtValues();
    return `
      Monthly PhilHealth employee share is computed as 2.5% of the contribution base.
      <br/>
      Contribution base uses a floor of 10,000 and ceiling of 100,000 from your income ${fmtMonthlyBasicIncome}.
      <br/>
      PhilHealth = contribution base x 2.5% = ${fmtMonthlyPhilHealth}.
    `;
  }

  private getMonthlyPagIbigExplanation() {
    const { fmtMonthlyBasicIncome, fmtMonthlyPagIbig } = this.getfmtValues();
    return `
      Monthly Pag-IBIG employee share is computed as 2% of compensation income, capped at a 10,000 base.
      <br/>
      For monthly basic income ${fmtMonthlyBasicIncome}, contribution base is min(income, 10,000).
      <br/>
      Pag-IBIG = contribution base x 2% = ${fmtMonthlyPagIbig}.
    `;
  }

  private getMonthlyDeductionsExplanation() {
    const {
      fmtMonthlySss,
      fmtMonthlyPhilHealth,
      fmtMonthlyPagIbig,
      fmtMonthlyDeductions,
    } = this.getfmtValues();
    return `
      Monthly deductions are SSS + PhilHealth + Pag-IBIG.
      So, ${fmtMonthlySss} + ${fmtMonthlyPhilHealth} + ${fmtMonthlyPagIbig} = ${fmtMonthlyDeductions}.
    `;
  }

  private getMonthlyTaxableIncomeExplanation() {
    const {
      fmtMonthlyBasicIncome,
      fmtMonthlyDeductions,
      fmtMonthlyTaxableIncome,
    } = this.getfmtValues();
    return `
      Monthly taxable income is monthly basic income minus monthly deductions.
      So, ${fmtMonthlyBasicIncome} - ${fmtMonthlyDeductions} = ${fmtMonthlyTaxableIncome}.
    `;
  }

  private getMonthlyIncomeTaxExplanation() {
    const { fmtMonthlyIncomeTax, fmtIncomeTax } = this.getfmtValues();
    return `
      Monthly income tax is annual income tax divided by 12.
      So, ${fmtIncomeTax} / 12 = ${fmtMonthlyIncomeTax}.
    `;
  }

  private getMonthlyTakeHomePayExplanation() {
    const {
      fmtMonthlyBasicIncome,
      fmtMonthlyDeductions,
      fmtMonthlyIncomeTax,
      fmtMonthlyTakeHomePay,
    } = this.getfmtValues();
    return `
      Monthly take home pay is monthly basic income minus monthly deductions minus monthly income tax.
      So, ${fmtMonthlyBasicIncome} - ${fmtMonthlyDeductions} - ${fmtMonthlyIncomeTax} = ${fmtMonthlyTakeHomePay}.
    `;
  }

  private getAnnualGrossIncomeExplanation() {
    const { fmtMonthlyBasicIncome, fmtAnnualGrossIncome } = this.getfmtValues();
    return `
      Annual gross income is monthly basic income multiplied by 12.
      So, ${fmtMonthlyBasicIncome} * 12 = ${fmtAnnualGrossIncome}.
    `;
  }

  private getAnnualDeductionsExplanation() {
    const { fmtMonthlyDeductions, fmtAnnualDeductions } = this.getfmtValues();
    return `
      Annual deductions are monthly deductions multiplied by 12.
      So, ${fmtMonthlyDeductions} * 12 = ${fmtAnnualDeductions}.
    `;
  }

  private getannualTaxableIncomeExplanation() {
    const {
      fmtAnnualGrossIncome,
      fmtAnnualDeductions,
      fmtannualTaxableIncome,
    } = this.getfmtValues();
    return `
      Your annual taxable income is ${fmtannualTaxableIncome}.
      This is annual gross income minus annual deductions.
      So, ${fmtAnnualGrossIncome} - ${fmtAnnualDeductions} = ${fmtannualTaxableIncome}.
      <br/>
      Annual deductions include government mandated benefits such as SSS, Pag-IBIG, and PhilHealth.
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
          So, your annual tax is ${fmtExcess} * ${fmtExcessTaxRate} = ${fmtIncomeTax}.`;
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
    return this.annualGrossIncome - this.annualDeductions - this._annualIncomeTax;
  }

  private getAnnualNetIncomeExaplanation() {
    const {
      fmtAnnualGrossIncome,
      fmtAnnualDeductions,
      fmtNetIncome,
      fmtIncomeTax,
    } =
      this.getfmtValues();
    return `
      Your annual gross income is ${fmtAnnualGrossIncome}, annual deductions are ${fmtAnnualDeductions}, and annual income tax is ${fmtIncomeTax}.
      Then your annual net income is ${fmtAnnualGrossIncome} - ${fmtAnnualDeductions} - ${fmtIncomeTax} = ${fmtNetIncome}.
    `;
  }
}
