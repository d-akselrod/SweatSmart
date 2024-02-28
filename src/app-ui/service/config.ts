// @ts-ignore
import { API_URL_LOCAL, API_URL_DEPLOY, API_JWT } from '@env';

const isLocalDev = true;

export const API_URL = isLocalDev ? API_URL_LOCAL : API_URL_DEPLOY;
export const API_AUTH = `Bearer ${API_JWT}`;
