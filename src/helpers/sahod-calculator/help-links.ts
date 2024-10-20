import { RESULT_ATTRIBUTES } from '@/constants/sahod-calculator/results';

export const getHelpLink = (attribute: RESULT_ATTRIBUTES) => {
  switch (attribute) {
    case RESULT_ATTRIBUTES.ANNUAL_INCOME_TAX:
      return {
        link: 'https://www.bir.gov.ph/income-tax',
        displayText:
          'More info: BIR Tax Rate (scroll down to INCOME TAX RATES)',
      };
    case RESULT_ATTRIBUTES.ANNUAL_TAXABLE_INCOME:
      return {
        link: 'https://www.bir.gov.ph/income-tax',
        displayText:
          'More info: See FAQS - What are some of the exclusions from gross income?',
      };
    default:
      undefined;
  }
};
