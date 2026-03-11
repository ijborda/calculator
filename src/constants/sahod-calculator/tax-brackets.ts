export const TAX_BRACKETS = [
  {
    // 0%
    id: '1st',
    bounds: {
      inclusiveLower: 0,
      inclusiveUpper: 250_000,
    },
    fixedTax: 0,
    excessTaxRate: 0,
  },
  {
    // 20% of the excess over P250,000
    id: '2nd',
    bounds: {
      inclusiveLower: 250_000 + 1,
      inclusiveUpper: 400_000,
    },
    fixedTax: 0,
    excessTaxRate: 0.2,
  },
  {
    // P30,000 + 25% of the excess over P400,000
    id: '3rd',
    bounds: {
      inclusiveLower: 400_000 + 1,
      inclusiveUpper: 800_000,
    },
    fixedTax: 30_000,
    excessTaxRate: 0.25,
  },
  {
    // P130,000 + 30% of the excess over P800,000
    id: '4th',
    bounds: {
      inclusiveLower: 800_000 + 1,
      inclusiveUpper: 2_000_000,
    },
    fixedTax: 130_000,
    excessTaxRate: 0.3,
  },
  {
    // P490,000 + 32% of the excess over P2,000,000
    id: '5th',
    bounds: {
      inclusiveLower: 2_000_000 + 1,
      inclusiveUpper: 8_000_000,
    },
    fixedTax: 490_000,
    excessTaxRate: 0.32,
  },
  {
    // P2,410,000 + 35% of the excess over P8,000,000
    id: '6th',
    bounds: {
      inclusiveLower: 8_000_000 + 1,
      inclusiveUpper: Infinity,
    },
    fixedTax: 2_410_000,
    excessTaxRate: 0.35,
  },
];
