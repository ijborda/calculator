export const TAX_RATES = [
  {
    // 0%
    inclusiveBounds: [0, 250000],
    fixedTax: 0,
    excessTaxRate: 0,
  },
  {
    // 20% of the excess over P250,000
    inclusiveBounds: [250000 + 1, 400000],
    fixedTax: 0,
    excessTaxRate: 0.2,
  },
  {
    // P30,000 + 25% of the excess over P400,000
    inclusiveBounds: [400000 + 1, 800000],
    fixedTax: 30000,
    excessTaxRate: 0.25,
  },
  {
    // P130,000 + 30% of the excess over P800,000
    inclusiveBounds: [800000 + 1, 20000000],
    fixedTax: 130_000,
    excessTaxRate: 0.3,
  },
  {
    // P490,000 + 32% of the excess over P2,000,000
    inclusiveBounds: [20000000 + 1, 8000000],
    fixedTax: 490_000,
    excessTaxRate: 0.32,
  },
  {
    // P2,410,000 + 35% of the excess over P8,000,000
    inclusiveBounds: [8000000 + 1, Infinity],
    fixedTax: 2_410_000,
    excessTaxRate: 0.35,
  },
];
