'use client';

import { UIError } from './ui-error';

class Logger {
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

export const logger = new Logger();
