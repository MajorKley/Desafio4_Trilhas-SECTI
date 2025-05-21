const fs = require('fs');
const path = require('path');

// Valida se as variáveis existem
if (!process.env.API_URL || !process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error("Variáveis de ambiente faltando!");
}

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