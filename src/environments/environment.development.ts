export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  jwt: {
    accessTokenExpiry: 15 * 60 * 1000,
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000,
  },
  security: {
    enableCSP: true,
    enableHTTPS: false,
    secureCookies: false
  }
};
