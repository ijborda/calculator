import { IResult, IResultUpdate } from '@/app/interface/tax-calculator/data';

/*
 * Update results with new values
 */
export const reducer = (
  results: IResult[],
  updates: IResultUpdate[]
): IResult[] => {
  updates.forEach((update) => {
    const targetIndex = results.findIndex(
      (result) => result.name === update.name
    );
    if (targetIndex !== -1) {
      results[targetIndex] = { ...results[targetIndex], ...update };
    }
  });
  return results;
};
