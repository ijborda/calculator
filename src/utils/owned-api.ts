import axios, { AxiosError, type AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@/configs/config';
import { UIError } from './ui-error';

class OwnedApi {
  constructor() {}

  create(): AxiosInstance {
    // Create instance
    const instance = axios.create({
      baseURL: config.api.baseUrl ?? '',
      timeout: 20000, // 20 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Add error handler on request interceptor
    instance.interceptors.response.use(
      function (response: AxiosResponse) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response.data;
      },
      function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const responseMessage = (error.response?.data as any)?.message;
        const badRequestResponseMessage = (error.response?.data as any).data[0]
          ?.reason;
        if (
          (error.response?.data as any).status === 'BAD_REQUEST' &&
          badRequestResponseMessage
        ) {
          return Promise.reject(new UIError(badRequestResponseMessage));
        } else if (responseMessage) {
          return Promise.reject(new UIError(responseMessage));
        } else {
          return Promise.reject(error);
        }
      }
    );
    return instance;
  }
}

export const ownedApi = new OwnedApi().create();
