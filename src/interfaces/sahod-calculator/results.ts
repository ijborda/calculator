import { RESULT_ATTRIBUTES } from '@/constants/sahod-calculator/results';

/*
 * Basic form of tax result
 */
export interface IResult {
  name: RESULT_ATTRIBUTES;
  value: string;
  explanation: string;
}

/*
 * Basic form of tax result for updates
 * Name is required, but other attributes are optional
 */
export type IResultUpdate = Pick<IResult, 'name'> & Partial<IResult>;
