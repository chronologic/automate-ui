import { isTruthy } from './utils';

export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || '1');
export const API_URL = process.env.REACT_APP_API_URL as string;
export const MAINTENANCE_MODE = isTruthy(process.env.REACT_APP_MAINTENANCE_MODE as any);
