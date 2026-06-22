export const environment = {
  production: true,
  apiUrl: 'https://booka-backend-xg0v.onrender.com',
  googleClientId: '337542092911-44hlk878e2qq6jdgn3ovu418h9sc7b8s.apps.googleusercontent.com',
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
