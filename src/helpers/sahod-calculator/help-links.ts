import { RESULT_ATTRIBUTES } from '@/constants/sahod-calculator/results';

export const getHelpLink = (attribute: RESULT_ATTRIBUTES) => {
  switch (attribute) {
    case RESULT_ATTRIBUTES.MONTHLY_SSS:
      return {
        link: 'https://www.sss.gov.ph/wp-content/uploads/2024/12/Cir-2024-006-Employers-scaled.jpg',
        displayText: 'More info: SSS Circular 2024-006 Contribution Table',
      };
    case RESULT_ATTRIBUTES.ANNUAL_INCOME_TAX:
      return {
        link: 'https://www.bir.gov.ph/tax-code',
        displayText:
          'Scroll into Chapter 3 (Tax on Individuals) > Section 24 (Income Tax Rates) > A (Rates of Income Tax on Individual Citizen and Individual Resident Alien of the Philippines) > 2 ( Rates of Tax on Taxable Income of Individuals)',
      };
    case RESULT_ATTRIBUTES.ANNUAL_TAXABLE_INCOME:
      return {
        link: 'https://www.bir.gov.ph/tax-code',
        displayText:
          'Scroll into Chapter 3 (Tax on Individuals) > Section 24 (Income Tax Rates) > A (Rates of Income Tax on Individual Citizen and Individual Resident Alien of the Philippines) > 2 ( Rates of Tax on Taxable Income of Individuals)',
      };
    default:
      undefined;
  }
};
