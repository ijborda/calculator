'use client';

import { UIError } from './UIError';

class ErrorLogger {
  async call<T>(fn: (...args: any[]) => Promise<T>) {
    try {
      return await fn();
    } catch (err: unknown) {
      if (err instanceof UIError && err.allowLog === true) {
        console.log(err);
      }
      return;
    }
  }
}

export const errorLogger = new ErrorLogger();
