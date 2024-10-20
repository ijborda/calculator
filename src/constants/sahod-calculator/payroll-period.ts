/*
 * Defines the multiplier to get total taxable income
 */
export enum PAYROLL_PERIOD {
  SEMI_MONTHLY = 24,
  MONTHLY = 12,
  ANNUAL = 1,
}

const { SEMI_MONTHLY, MONTHLY, ANNUAL } = PAYROLL_PERIOD;

export const payrollPeriodOptions = [
  {
    value: SEMI_MONTHLY,
    label: 'Semi Monthly',
  },
  {
    value: MONTHLY,
    label: 'Monthly',
  },
  {
    value: ANNUAL,
    label: 'Annual',
  },
];
