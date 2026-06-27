export const TAX_BRACKETS = [
  {
    id: '1st',
    bounds: {
      inclusiveLower: 0,
      inclusiveUpper: 250_000,
    },
    fixedTax: 0,
    excessTaxRate: 0,
  },
  {
    id: '2nd',
    bounds: {
      inclusiveLower: 250_000 + 1,
      inclusiveUpper: 400_000,
    },
    fixedTax: 0,
    excessTaxRate: 0.15,
  },
  {
    id: '3rd',
    bounds: {
      inclusiveLower: 400_000 + 1,
      inclusiveUpper: 800_000,
    },
    fixedTax: 22_500,
    excessTaxRate: 0.20,
  },
  {
    id: '4th',
    bounds: {
      inclusiveLower: 800_000 + 1,
      inclusiveUpper: 2_000_000,
    },
    fixedTax: 102_500,
    excessTaxRate: 0.25,
  },
  {
    id: '5th',
    bounds: {
      inclusiveLower: 2_000_000 + 1,
      inclusiveUpper: 8_000_000,
    },
    fixedTax: 402_500,
    excessTaxRate: 0.30,
  },
  {
    id: '6th',
    bounds: {
      inclusiveLower: 8_000_000 + 1,
      inclusiveUpper: Infinity,
    },
    fixedTax: 2_202_500,
    excessTaxRate: 0.35,
  },
];
