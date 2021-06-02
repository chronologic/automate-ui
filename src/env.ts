import { isTruthy } from './utils';

export const API_URL = process.env.REACT_APP_API_URL as string;
export const MAINTENANCE_MODE = isTruthy(
  process.env.REACT_APP_MAINTENANCE_MODE as any
);
