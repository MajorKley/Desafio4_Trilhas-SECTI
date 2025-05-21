const fs = require('fs');
const path = require('path');

const env = {
    API_URL: process.env.API_URL,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
};

const configPath = path.join(__dirname, 'config.js');
const configContent = `
window.APP_CONFIG = {
  API_URL: "${env.API_URL}",
  GOOGLE_MAPS_API_KEY: "${env.GOOGLE_MAPS_API_KEY}"
};
`;

fs.writeFileSync(configPath, configContent);