// js/inject-env.js
const fs = require('fs');
const path = require('path');

// Validação das variáveis
console.log("[DEBUG] API_URL:", process.env.API_URL); // Deve mostrar a URL real
console.log("[DEBUG] GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY?.substring(0, 10) + "***"); // Mostra parte da chave

if (!process.env.API_URL || !process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error("Variáveis de ambiente não definidas!");
}

const configPath = path.join(__dirname, "config.js");

const configContent = `
window.APP_CONFIG = {
  API_URL: "${process.env.API_URL}",
  GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY}"
};
`;

fs.writeFileSync(configPath, configContent);
console.log("[SUCESSO] config.js gerado com valores reais!");