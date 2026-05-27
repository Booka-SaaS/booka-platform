const runtimeConfig = (globalThis as {
  __BOOKA_CONFIG__?: { apiUrl?: string };
  process?: { env?: Record<string, string | undefined> };
}).__BOOKA_CONFIG__;

const runtimeEnv = (globalThis as {
  process?: { env?: Record<string, string | undefined> };
}).process?.env;

export const environment = {
  production: true,
  apiUrl: runtimeConfig?.apiUrl || runtimeEnv?.['BOOKA_API_URL'] || runtimeEnv?.['VITE_API_URL'] || 'http://localhost:3001',
  jwt: {
    accessTokenExpiry: 15 * 60 * 1000,
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000,
  },
  security: {
    enableCSP: true,
    enableHTTPS: true,
    secureCookies: true
  }
};
