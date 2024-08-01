import { getEnvValue } from './utils';

const appPort = getEnvValue('NEXT_PUBLIC_APP_PORT');
const appSchema = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL');
const appHost = getEnvValue('NEXT_PUBLIC_APP_HOST');
const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');
const isDev = getEnvValue('NEXT_PUBLIC_APP_ENV') === 'development';
const walletUrl = getEnvValue('NEXT_PUBLIC_WALLET_API_URL');
const app = Object.freeze({
  isDev,
  protocol: appSchema,
  host: appHost,
  port: appPort,
  baseUrl,
  walletUrl,
  useProxy: getEnvValue('NEXT_PUBLIC_USE_NEXT_JS_PROXY') === 'true',
});

export default app;
