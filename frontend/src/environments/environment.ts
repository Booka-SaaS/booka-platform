export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
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
