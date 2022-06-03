import { isTruthy } from './utils';

export const API_URL = process.env.REACT_APP_API_URL as string;
export const FULLSTORY_ORG_ID = process.env.REACT_APP_FULLSTORY_ORG_ID as string;
export const ALLOW_SIGNUP = isTruthy(process.env.REACT_APP_ALLOW_SIGNUP as any);
export const MAINTENANCE_MODE = isTruthy(process.env.REACT_APP_MAINTENANCE_MODE as any);
