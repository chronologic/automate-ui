import { notification } from 'antd';

export function withErrorHandler<T extends Function>(fn: T): T {
  return function inner(...args: any[]) {
    return fn(...args).catch((e: any) => {
      notification.error({
        message:
          e.response?.data?.error?.message ||
          e.response?.data?.message ||
          e.response?.data?.error ||
          e.message ||
          'Error',
      });
      throw e;
    });
  } as any;
}
