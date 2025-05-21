const fs = require('fs');
const path = require('path');

const configContent = `
window.APP_CONFIG = {
  API_URL: "${process.env.API_URL}",
  GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY}"
};
`;

fs.writeFileSync(
    path.join(__dirname, '../js/config.js'),
    configContent
);