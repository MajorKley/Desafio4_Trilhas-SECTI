// js/inject-env.js
const fs = require('fs');
const path = require('path');

// Debug: Verifica se as variáveis estão presentes
console.log("[DEBUG] API_URL:", process.env.API_URL || "[NÃO DEFINIDA]");
console.log("[DEBUG] GOOGLE_MAPS_API_KEY:", process.env.GOOGLE_MAPS_API_KEY ? "***" + process.env.GOOGLE_MAPS_API_KEY.slice(-5) : "[NÃO DEFINIDA]");

if (!process.env.API_URL || !process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error("❌ Variáveis de ambiente não definidas!");
}

// Caminho absoluto para config.js
const configPath = path.join(__dirname, "config.js"); // __dirname já está em js/

// Conteúdo do arquivo
const configContent = `
window.APP_CONFIG = {
  API_URL: "${process.env.API_URL}",
  GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY}"
};
`;

// Escreve o arquivo
try {
    fs.writeFileSync(configPath, configContent);
    console.log("✅ config.js gerado com sucesso!");
} catch (err) {
    console.error("Erro ao escrever config.js:", err);
    process.exit(1);
}