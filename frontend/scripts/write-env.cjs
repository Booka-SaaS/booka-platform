const fs = require('node:fs');
const path = require('node:path');

const apiUrl =
  process.env.BOOKA_API_URL ||
  process.env.NG_APP_API_URL ||
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

const googleClientId =
  process.env.BOOKA_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  '';

const publicDir = path.join(__dirname, '..', 'public');
const outputPath = path.join(publicDir, 'env.js');

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.__BOOKA_CONFIG__ = {\n  apiUrl: ${JSON.stringify(apiUrl)},\n  googleClientId: ${JSON.stringify(googleClientId)}\n};\n`,
);
