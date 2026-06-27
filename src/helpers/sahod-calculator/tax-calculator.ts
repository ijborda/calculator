import { TAX_BRACKETS } from '@/constants/sahod-calculator/tax-brackets';
import { SSS_BRACKETS } from '@/constants/sahod-calculator/sss-brackets';
import { formatPhpCurrency } from '@/utils/currency';
import BigNumber from 'bignumber.js';

export class TaxCalculator {
  // Inputs
  private monthlyBasicIncome: BigNumber;

  // Monthly values
  public monthlySss: BigNumber;
  public monthlyPhilHealth: BigNumber;
  public monthlyPagIbig: BigNumber;
  public monthlyContributions: BigNumber;
  public monthlyDeductions: BigNumber;
  public monthlyTaxableIncome: BigNumber;
  public monthlyIncomeTax: BigNumber;
  public monthlyTakeHomePay: BigNumber;

  // Annual values
  public annualGrossIncome: BigNumber;
  public annualContributions: BigNumber;
  public annualDeductions: BigNumber;
  public annualTaxableIncome: BigNumber;
  public annualEffectiveTaxRate: BigNumber;

  // Tax bracket in use
  private taxBracket: (typeof TAX_BRACKETS)[0];

  // Portion of taxable income covered by previous bracket
  private excessOver: BigNumber;

  // Portion of taxable income covered by current bracket
  private excess: BigNumber;

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
  private _annualIncomeTax: BigNumber;
  private _annualTaxableIncomeExplanation: string;
  private _annualIncomeTaxExplanation: string;
  private _annualEffectiveTaxRateExplanation: string;
  private _annualNetIncome: BigNumber;
  private _annualNetIncomeExplanation: string;

  private readonly money = (amount: BigNumber.Value) =>
    new BigNumber(amount).decimalPlaces(2, BigNumber.ROUND_HALF_UP);

  constructor(monthlyBasicIncome: number) {
    this.monthlyBasicIncome = this.money(Math.max(monthlyBasicIncome, 0));
    this.monthlySss = this.getMonthlySss();
    this.monthlyPhilHealth = this.getMonthlyPhilHealth();
    this.monthlyPagIbig = this.getMonthlyPagIbig();
    this.monthlyDeductions =
      this.monthlySss.plus(this.monthlyPhilHealth).plus(this.monthlyPagIbig);
    this.monthlyContributions = this.monthlyDeductions;
    this.monthlyTaxableIncome = BigNumber.max(
      this.monthlyBasicIncome.minus(this.monthlyDeductions),
      0
    ).decimalPlaces(2, BigNumber.ROUND_HALF_UP);

    this.annualGrossIncome = this.money(this.monthlyBasicIncome.multipliedBy(12));
    this.annualDeductions = this.money(this.monthlyDeductions.multipliedBy(12));
    this.annualContributions = this.annualDeductions;
    this.annualTaxableIncome = this.money(
      this.monthlyTaxableIncome.multipliedBy(12)
    );
    this.taxBracket = this.getTaxBracket();
    this.excessOver = this.money(this.taxBracket.bounds.inclusiveLower).minus(1);
    this.excess = this.money(this.annualTaxableIncome.minus(this.excessOver));

    this._annualIncomeTax = this.getAnnualIncomeTax();
    this.annualEffectiveTaxRate = this.getAnnualEffectiveTaxRate();
    this.monthlyIncomeTax = this.money(this._annualIncomeTax.dividedBy(12));
    this.monthlyTakeHomePay = BigNumber.max(
      this.monthlyBasicIncome
        .minus(this.monthlyDeductions)
        .minus(this.monthlyIncomeTax),
      0
    ).decimalPlaces(2, BigNumber.ROUND_HALF_UP);
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
    this._annualEffectiveTaxRateExplanation =
      this.getAnnualEffectiveTaxRateExplanation();
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

  public get monthlyContributionsExplanation() {
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

  public get annualContributionsExplanation() {
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

  public get annualEffectiveTaxRateExplanation() {
    return this._annualEffectiveTaxRateExplanation;
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
        this.annualTaxableIncome.isGreaterThanOrEqualTo(inclusiveLower) &&
        (inclusiveUpper === Infinity ||
          this.annualTaxableIncome.isLessThanOrEqualTo(inclusiveUpper))
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
    const fmtAnnualEffectiveTaxRate = `${this.annualEffectiveTaxRate.toFixed(2)}%`;
    const fmtVariableTax = formatPhpCurrency(
      this.excess.multipliedBy(excessTaxRate)
    );
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
      fmtAnnualEffectiveTaxRate,
      fmtVariableTax,
      fmtNetIncome,
    };
  };

  private getMonthlySss() {
    return this.money(this.getSssBracket().employeeTotal);
  }

  private getSssBracket() {
    const sssBracket = SSS_BRACKETS.find(
      ({ minSalary, maxSalary }) =>
        this.monthlyBasicIncome.isGreaterThanOrEqualTo(minSalary) &&
        (maxSalary === Infinity || this.monthlyBasicIncome.isLessThanOrEqualTo(maxSalary))
    );
    if (!sssBracket) throw new Error('Cannot find SSS bracket.');
    return sssBracket;
  }

  private getMonthlyPhilHealth() {
    // Employee share approximation: 2.5% of salary (half of 5% premium), floor 10k, cap 100k.
    const contributionBase = BigNumber.min(
      BigNumber.max(this.monthlyBasicIncome, this.money(10_000)),
      this.money(100_000)
    );
    return this.money(contributionBase.multipliedBy(0.025));
  }

  private getMonthlyPagIbig() {
    // Employee share: 2% up to a maximum monthly contribution of 100.
    const contributionBase = BigNumber.min(this.monthlyBasicIncome, this.money(10_000));
    return this.money(contributionBase.multipliedBy(0.02));
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
      Monthly contributions are SSS + PhilHealth + Pag-IBIG.
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
      Monthly taxable income is monthly basic income minus monthly contributions.
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
      Monthly take home pay is monthly basic income minus monthly contributions minus monthly income tax.
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
      Annual contributions are monthly contributions multiplied by 12.
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
      This is annual gross income minus annual contributions.
      So, ${fmtAnnualGrossIncome} - ${fmtAnnualDeductions} = ${fmtannualTaxableIncome}.
      <br/>
      Annual contributions include government mandated benefits such as SSS, Pag-IBIG, and PhilHealth.
    `;
  }

  private getAnnualIncomeTax() {
    const { fixedTax, excessTaxRate } = this.taxBracket;
    const tax = this.excess.multipliedBy(excessTaxRate).plus(fixedTax);
    return this.money(tax);
  }

  private getAnnualEffectiveTaxRate() {
    if (this.annualGrossIncome.isZero()) return this.money(0);
    return this.money(
      this._annualIncomeTax.dividedBy(this.annualGrossIncome).multipliedBy(100)
    );
  }

  private getAnnualEffectiveTaxRateExplanation() {
    const { fmtAnnualGrossIncome, fmtIncomeTax, fmtAnnualEffectiveTaxRate } =
      this.getfmtValues();
    return `
      Effective tax rate is annual income tax divided by annual gross income.
      <br/>
      So, ${fmtIncomeTax} / ${fmtAnnualGrossIncome} = ${fmtAnnualEffectiveTaxRate}.
    `;
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
    return this.money(
      this.annualGrossIncome
        .minus(this.annualDeductions)
        .minus(this._annualIncomeTax)
    );
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
      Your annual gross income is ${fmtAnnualGrossIncome}, annual contributions are ${fmtAnnualDeductions}, and annual income tax is ${fmtIncomeTax}.
      Then your annual net income is ${fmtAnnualGrossIncome} - ${fmtAnnualDeductions} - ${fmtIncomeTax} = ${fmtNetIncome}.
    `;
  }
}
