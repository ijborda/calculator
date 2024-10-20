import { RESULT_ATTRIBUTES } from '@/constants/tax-calculator/attributes';

export const getHelpLink = (attribute: RESULT_ATTRIBUTES) => {
  switch (attribute) {
    case RESULT_ATTRIBUTES.INCOME_TAX:
      return {
        link: 'https://www.bir.gov.ph/income-tax',
        displayText:
          'More info: BIR Tax Rate (scroll down to INCOME TAX RATES)',
      };
    default:
      undefined;
  }
};
