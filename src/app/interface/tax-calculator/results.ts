/*
 * Basic form of tax result
 */
export interface IResult {
  name: string;
  value: string;
  explanation: string;
}

/*
 * Basic form of tax result for updates
 * Name is required, but other attributes are optional
 */
export type IResultUpdate = Pick<IResult, 'name'> & Partial<IResult>;
