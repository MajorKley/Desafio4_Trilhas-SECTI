// js/inject-env.js
const fs = require('fs');
const path = require('path');

// Debug: Mostra variáveis (sem optional chaining)
console.log("API_URL:", process.env.API_URL || "[NÃO DEFINIDA]");
console.log("GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY ? "***" + process.env.GOOGLE_MAPS_API_KEY.slice(-5) : "[NÃO DEFINIDA]");

// Validação rigorosa
if (!process.env.API_URL || !process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error("❌ Variáveis de ambiente faltando!");
}

// Gera config.js
const configPath = path.join(__dirname, "config.js");
const configContent = `
window.APP_CONFIG = {
  API_URL: "${process.env.API_URL}",
  GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY}"
};
`;
try {
    fs.writeFileSync(configPath, configContent);
} catch (err) {
    console.error("Erro ao escrever arquivo:", err);
}

fs.writeFileSync(configPath, configContent);
console.log("✅ config.js gerado com sucesso!");