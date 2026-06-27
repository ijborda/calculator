import BigNumber from 'bignumber.js';
import { TAX_BRACKETS } from '@/constants/sahod-calculator/tax-brackets';
import { SSS_BRACKETS } from '@/constants/sahod-calculator/sss-brackets';
import { formatPhpCurrency } from '@/utils/currency';

const TAX_FREE_BONUS_THRESHOLD = 90_000;

export class AnnualTaxCalculator {
  private annualIncome: BigNumber;
  private annualBonusesAndAllowances: BigNumber;
  private monthlyIncome: BigNumber;

  public annualSss: BigNumber;
  public annualPhilHealth: BigNumber;
  public annualPagIbig: BigNumber;
  public annualDeductions: BigNumber;
  public annualTaxableIncome: BigNumber;
  public annualGrossIncome: BigNumber;
  public annualIncomeTax: BigNumber;
  public annualEffectiveTaxRate: BigNumber;
  public annualNetToGrossRate: BigNumber;
  public annualNetIncome: BigNumber;

  private taxBracket: (typeof TAX_BRACKETS)[0];
  private excessOver: BigNumber;
  private excess: BigNumber;

  private readonly money = (amount: BigNumber.Value) =>
    new BigNumber(amount).decimalPlaces(2, BigNumber.ROUND_HALF_UP);

  constructor(
    annualIncome: number,
    annualBonusesAndAllowances: number
  ) {
    this.annualIncome = this.money(Math.max(annualIncome, 0));
    this.annualBonusesAndAllowances = this.money(
      Math.max(annualBonusesAndAllowances, 0)
    );
    this.monthlyIncome = this.money(this.annualIncome.dividedBy(12));

    this.annualSss = this.money(this.getMonthlySss().multipliedBy(12));
    this.annualPhilHealth = this.money(this.getMonthlyPhilHealth().multipliedBy(12));
    this.annualPagIbig = this.money(this.getMonthlyPagIbig().multipliedBy(12));
    this.annualDeductions = this.money(
      this.annualSss.plus(this.annualPhilHealth).plus(this.annualPagIbig)
    );

    const taxableBonusPortion = this.money(
      BigNumber.max(this.annualBonusesAndAllowances.minus(TAX_FREE_BONUS_THRESHOLD), 0)
    );

    this.annualTaxableIncome = this.money(
      BigNumber.max(
        this.annualIncome.minus(this.annualDeductions).plus(taxableBonusPortion),
        0
      )
    );

    this.annualGrossIncome = this.money(
      this.annualIncome.plus(this.annualBonusesAndAllowances)
    );

    this.taxBracket = this.getTaxBracket();
    this.excessOver = this.money(this.taxBracket.bounds.inclusiveLower).minus(1);
    this.excess = this.money(this.annualTaxableIncome.minus(this.excessOver));

    this.annualIncomeTax = this.getAnnualIncomeTax();
    this.annualEffectiveTaxRate = this.getAnnualEffectiveTaxRate();
    this.annualNetIncome = this.money(
      this.annualGrossIncome.minus(this.annualDeductions).minus(this.annualIncomeTax)
    );
    this.annualNetToGrossRate = this.getAnnualNetToGrossRate();
  }

  public get annualIncomeExplanation() {
    const { fmtAnnualIncome } = this.getFmtValues();
    return `
      Annual income is the earnings base used to compute mandatory deductions.
      <br/>
      Input annual income: ${fmtAnnualIncome}.
    `;
  }

  public get annualBonusesAndAllowancesExplanation() {
    const { fmtAnnualBonusesAndAllowances } = this.getFmtValues();
    return `
      Annual bonuses and allowances are additional annual earnings.
      <br/>
      Input bonuses and allowances: ${fmtAnnualBonusesAndAllowances}.
    `;
  }

  public get annualSssExplanation() {
    const {
      fmtMonthlyIncome,
      fmtAnnualSss,
      fmtSssBracketMin,
      fmtSssBracketMax,
      fmtSssMsc,
      fmtSssEmployeeRegular,
      fmtSssEmployeeMpf,
    } = this.getFmtValues();
    return `
      Annual SSS is based on monthly income using the SSS bracket table, then multiplied by 12.
      <br/>
      Monthly income ${fmtMonthlyIncome} falls between ${fmtSssBracketMin} and ${fmtSssBracketMax} with salary credit ${fmtSssMsc}.
      <br/>
      Monthly SSS employee share = ${fmtSssEmployeeRegular} + ${fmtSssEmployeeMpf}. Annual SSS = monthly share x 12 = ${fmtAnnualSss}.
    `;
  }

  public get annualPhilHealthExplanation() {
    const { fmtMonthlyIncome, fmtAnnualPhilHealth } = this.getFmtValues();
    return `
      Annual PhilHealth is computed from monthly income with floor 10,000 and ceiling 100,000, at 2.5% employee share per month, then multiplied by 12.
      <br/>
      Monthly income basis: ${fmtMonthlyIncome}. Annual PhilHealth = ${fmtAnnualPhilHealth}.
    `;
  }

  public get annualPagIbigExplanation() {
    const { fmtMonthlyIncome, fmtAnnualPagIbig } = this.getFmtValues();
    return `
      Annual Pag-IBIG is computed as 2% of monthly income capped at a 10,000 monthly base, then multiplied by 12.
      <br/>
      Monthly income basis: ${fmtMonthlyIncome}. Annual Pag-IBIG = ${fmtAnnualPagIbig}.
    `;
  }

  public get annualDeductionsExplanation() {
    const {
      fmtAnnualDeductions,
      fmtAnnualSss,
      fmtAnnualPhilHealth,
      fmtAnnualPagIbig,
    } = this.getFmtValues();
    return `
      Annual deductions are the sum of annual SSS, PhilHealth, and Pag-IBIG.
      <br/>
      So, ${fmtAnnualSss} + ${fmtAnnualPhilHealth} + ${fmtAnnualPagIbig} = ${fmtAnnualDeductions}.
    `;
  }

  public get annualTaxableIncomeExplanation() {
    const {
      fmtAnnualIncome,
      fmtAnnualDeductions,
      fmtTaxFreeBonusThreshold,
      fmtAnnualBonusesAndAllowances,
      fmtTaxableBonusPortion,
      fmtAnnualTaxableIncome,
    } = this.getFmtValues();
    return `
      Annual taxable income is annual income minus annual deductions, plus taxable bonus portion.
      <br/>
      The first ${fmtTaxFreeBonusThreshold} of bonuses and allowances is tax free.
      <br/>
      Taxable bonus portion = max(${fmtAnnualBonusesAndAllowances} - ${fmtTaxFreeBonusThreshold}, 0) = ${fmtTaxableBonusPortion}.
      <br/>
      So, ${fmtAnnualIncome} - ${fmtAnnualDeductions} + ${fmtTaxableBonusPortion} = ${fmtAnnualTaxableIncome}.
    `;
  }

  public get annualGrossIncomeExplanation() {
    const {
      fmtAnnualIncome,
      fmtAnnualBonusesAndAllowances,
      fmtAnnualGrossIncome,
    } = this.getFmtValues();
    return `
      Annual gross income is annual income plus bonuses and allowances.
      <br/>
      So, ${fmtAnnualIncome} + ${fmtAnnualBonusesAndAllowances} = ${fmtAnnualGrossIncome}.
    `;
  }

  public get annualIncomeTaxExplanation() {
    const { id } = this.taxBracket;
    const {
      fmtAnnualTaxableIncome,
      fmtExcessOver,
      fmtUpperBound,
      fmtFixedTax,
      fmtExcessTaxRate,
      fmtExcess,
      fmtAnnualIncomeTax,
      fmtVariableTax,
    } = this.getFmtValues();

    switch (id) {
      case '1st':
        return `
          Your annual taxable income is ${fmtAnnualTaxableIncome}.
          You fall on the ${id} tax bracket (up to ${fmtUpperBound}) so your annual income tax is ${fmtAnnualIncomeTax}.
        `;
      case '2nd':
        return `
          Your annual taxable income is ${fmtAnnualTaxableIncome}.
          You fall on the ${id} tax bracket (over ${fmtExcessOver} up to ${fmtUpperBound}).
          <br/>
          Tax = ${fmtExcessTaxRate} of excess over ${fmtExcessOver}.
          <br/>
          Excess = ${fmtAnnualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          <br/>
          Annual tax = ${fmtExcess} * ${fmtExcessTaxRate} = ${fmtAnnualIncomeTax}.
        `;
      case '6th':
        return `
          Your annual taxable income is ${fmtAnnualTaxableIncome}.
          You fall on the ${id} tax bracket (over ${fmtExcessOver}).
          <br/>
          Tax = ${fmtFixedTax} + ${fmtExcessTaxRate} of excess over ${fmtExcessOver}.
          <br/>
          Excess = ${fmtAnnualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          <br/>
          Annual tax = ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate}) = ${fmtFixedTax} + ${fmtVariableTax} = ${fmtAnnualIncomeTax}.
        `;
      default:
        return `
          Your annual taxable income is ${fmtAnnualTaxableIncome}.
          You fall on the ${id} tax bracket (over ${fmtExcessOver} up to ${fmtUpperBound}).
          <br/>
          Tax = ${fmtFixedTax} + ${fmtExcessTaxRate} of excess over ${fmtExcessOver}.
          <br/>
          Excess = ${fmtAnnualTaxableIncome} - ${fmtExcessOver} = ${fmtExcess}.
          <br/>
          Annual tax = ${fmtFixedTax} + (${fmtExcess} * ${fmtExcessTaxRate}) = ${fmtFixedTax} + ${fmtVariableTax} = ${fmtAnnualIncomeTax}.
        `;
    }
  }

  public get annualEffectiveTaxRateExplanation() {
    const { fmtAnnualGrossIncome, fmtAnnualIncomeTax, fmtAnnualEffectiveTaxRate } =
      this.getFmtValues();
    return `
      Effective tax rate is annual income tax divided by annual gross income.
      <br/>
      So, ${fmtAnnualIncomeTax} / ${fmtAnnualGrossIncome} = ${fmtAnnualEffectiveTaxRate}.
    `;
  }

  public get annualNetIncomeExplanation() {
    const {
      fmtAnnualGrossIncome,
      fmtAnnualDeductions,
      fmtAnnualIncomeTax,
      fmtAnnualNetIncome,
    } =
      this.getFmtValues();
    return `
      Annual net income is annual gross income minus annual deductions minus annual income tax.
      <br/>
      So, ${fmtAnnualGrossIncome} - ${fmtAnnualDeductions} - ${fmtAnnualIncomeTax} = ${fmtAnnualNetIncome}.
    `;
  }

  private getMonthlySss() {
    return this.money(this.getSssBracket().employeeTotal);
  }

  private getSssBracket() {
    const sssBracket = SSS_BRACKETS.find(
      ({ minSalary, maxSalary }) =>
        this.monthlyIncome.isGreaterThanOrEqualTo(minSalary) &&
        (maxSalary === Infinity || this.monthlyIncome.isLessThanOrEqualTo(maxSalary))
    );
    if (!sssBracket) throw new Error('Cannot find SSS bracket.');
    return sssBracket;
  }

  private getMonthlyPhilHealth() {
    const contributionBase = BigNumber.min(
      BigNumber.max(this.monthlyIncome, this.money(10_000)),
      this.money(100_000)
    );
    return this.money(contributionBase.multipliedBy(0.025));
  }

  private getMonthlyPagIbig() {
    const contributionBase = BigNumber.min(this.monthlyIncome, this.money(10_000));
    return this.money(contributionBase.multipliedBy(0.02));
  }

  private getTaxBracket() {
    const taxBracket = TAX_BRACKETS.find(
      ({ bounds: { inclusiveLower, inclusiveUpper } }) =>
        this.annualTaxableIncome.isGreaterThanOrEqualTo(inclusiveLower) &&
        (inclusiveUpper === Infinity ||
          this.annualTaxableIncome.isLessThanOrEqualTo(inclusiveUpper))
    );
    if (!taxBracket) throw new Error('Cannot find tax rate.');
    return taxBracket;
  }

  private getAnnualIncomeTax() {
    const { fixedTax, excessTaxRate } = this.taxBracket;
    const tax = this.excess.multipliedBy(excessTaxRate).plus(fixedTax);
    return this.money(tax);
  }

  private getAnnualEffectiveTaxRate() {
    if (this.annualGrossIncome.isZero()) return this.money(0);
    return this.money(this.annualIncomeTax.dividedBy(this.annualGrossIncome).multipliedBy(100));
  }

  private getAnnualNetToGrossRate() {
    if (this.annualGrossIncome.isZero()) return this.money(0);
    return this.money(this.annualNetIncome.dividedBy(this.annualGrossIncome).multipliedBy(100));
  }

  private getFmtValues() {
    const { bounds, fixedTax, excessTaxRate } = this.taxBracket;
    const sssBracket = this.getSssBracket();
    const fmtAnnualIncome = formatPhpCurrency(this.annualIncome);
    const fmtAnnualBonusesAndAllowances = formatPhpCurrency(
      this.annualBonusesAndAllowances
    );
    const fmtMonthlyIncome = formatPhpCurrency(this.monthlyIncome);
    const fmtAnnualSss = formatPhpCurrency(this.annualSss);
    const fmtAnnualPhilHealth = formatPhpCurrency(this.annualPhilHealth);
    const fmtAnnualPagIbig = formatPhpCurrency(this.annualPagIbig);
    const fmtAnnualDeductions = formatPhpCurrency(this.annualDeductions);
    const taxableBonusPortion = this.money(
      BigNumber.max(this.annualBonusesAndAllowances.minus(TAX_FREE_BONUS_THRESHOLD), 0)
    );
    const fmtTaxFreeBonusThreshold = formatPhpCurrency(TAX_FREE_BONUS_THRESHOLD);
    const fmtTaxableBonusPortion = formatPhpCurrency(taxableBonusPortion);
    const fmtAnnualTaxableIncome = formatPhpCurrency(this.annualTaxableIncome);
    const fmtAnnualGrossIncome = formatPhpCurrency(this.annualGrossIncome);
    const fmtExcessOver = formatPhpCurrency(this.excessOver);
    const fmtUpperBound = formatPhpCurrency(bounds.inclusiveUpper);
    const fmtFixedTax = formatPhpCurrency(fixedTax);
    const fmtExcessTaxRate = `${excessTaxRate * 100}%`;
    const fmtExcess = formatPhpCurrency(this.excess);
    const fmtAnnualIncomeTax = formatPhpCurrency(this.annualIncomeTax);
    const fmtVariableTax = formatPhpCurrency(
      this.excess.multipliedBy(excessTaxRate)
    );
    const fmtAnnualEffectiveTaxRate = `${this.annualEffectiveTaxRate.toFixed(2)}%`;
    const fmtAnnualNetIncome = formatPhpCurrency(this.annualNetIncome);
    const fmtSssBracketMin = formatPhpCurrency(sssBracket.minSalary);
    const fmtSssBracketMax = Number.isFinite(sssBracket.maxSalary)
      ? formatPhpCurrency(sssBracket.maxSalary)
      : 'and above';
    const fmtSssMsc = formatPhpCurrency(sssBracket.msc);
    const fmtSssEmployeeRegular = formatPhpCurrency(sssBracket.employeeRegular);
    const fmtSssEmployeeMpf = formatPhpCurrency(sssBracket.employeeMpf);

    return {
      fmtAnnualIncome,
      fmtAnnualBonusesAndAllowances,
      fmtMonthlyIncome,
      fmtAnnualSss,
      fmtAnnualPhilHealth,
      fmtAnnualPagIbig,
      fmtAnnualDeductions,
      fmtTaxFreeBonusThreshold,
      fmtTaxableBonusPortion,
      fmtAnnualTaxableIncome,
      fmtAnnualGrossIncome,
      fmtExcessOver,
      fmtUpperBound,
      fmtFixedTax,
      fmtExcessTaxRate,
      fmtExcess,
      fmtAnnualIncomeTax,
      fmtVariableTax,
      fmtAnnualEffectiveTaxRate,
      fmtAnnualNetIncome,
      fmtSssBracketMin,
      fmtSssBracketMax,
      fmtSssMsc,
      fmtSssEmployeeRegular,
      fmtSssEmployeeMpf,
    };
  }
}
