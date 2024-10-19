'use client';

import { Constants } from '@/constants/constants';
import { toaster } from './toaster';

class ApiCaller {
  async call<T>(
    fn: (...args: any[]) => Promise<T>,
    options: { showToast: boolean } = { showToast: true }
  ) {
    try {
      return await fn();
    } catch (err: unknown) {
      // Show error message on a toast
      if (options.showToast) {
        toaster.error(
          err instanceof Error ? err.message : Constants.DEFAULT_ERROR_MESSAGE
        );
      }
      // Throw error as is to error logger
      throw err;
    }
  }
}

export const apiCaller = new ApiCaller();
