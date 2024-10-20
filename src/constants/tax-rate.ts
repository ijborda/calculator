export const TAX_RATES = [
  {
    // 0%
    id: '1st',
    inclusiveBounds: [0, 250_000],
    fixedTax: 0,
    excessTaxRate: 0,
  },
  {
    // 20% of the excess over P250,000
    id: '2nd',
    inclusiveBounds: [250_000 + 1, 400_000],
    fixedTax: 0,
    excessTaxRate: 0.2,
  },
  {
    // P30,000 + 25% of the excess over P400,000
    id: '3rd',
    inclusiveBounds: [400_000 + 1, 800_000],
    fixedTax: 30000,
    excessTaxRate: 0.25,
  },
  {
    // P130,000 + 30% of the excess over P800,000
    id: '4th',
    inclusiveBounds: [800_000 + 1, 2_000_000],
    fixedTax: 130_000,
    excessTaxRate: 0.3,
  },
  {
    // P490,000 + 32% of the excess over P2,000,000
    id: '5th',
    inclusiveBounds: [2_000_0000 + 1, 8_000_000],
    fixedTax: 490_000,
    excessTaxRate: 0.32,
  },
  {
    // P2,410,000 + 35% of the excess over P8,000,000
    id: '6th',
    inclusiveBounds: [8_000_000 + 1, Infinity],
    fixedTax: 2_410_000,
    excessTaxRate: 0.35,
  },
];
