export const environment = {
  production: true,
  apiUrl: 'https://booka-backend-xg0v.onrender.com',
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
