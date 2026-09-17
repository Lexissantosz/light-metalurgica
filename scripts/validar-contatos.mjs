import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const arquivo = path.join(root, "data", "contato.json");
const config = JSON.parse(fs.readFileSync(arquivo, "utf8"));

const erros = [];
const avisos = [];

function digitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function parecePlaceholder(valor) {
  if (!valor) return false;
  const texto = String(valor).toLowerCase();
  return texto.includes("99999-9999") || texto.includes("999999999") || texto.includes("exemplo") || texto.includes("placeholder");
}

function validarWhatsApp(valor, rotulo) {
  const numero = digitos(valor);
  if (!numero) {
    erros.push(`${rotulo}: número ausente.`);
    return;
  }
  if (numero.length !== 13 || !numero.startsWith("55")) {
    erros.push(`${rotulo}: use número brasileiro completo com +55, DDD e 9 dígitos.`);
    return;
  }
  const celular = numero.slice(4);
  if (celular.length !== 9 || !celular.startsWith("9")) {
    erros.push(`${rotulo}: celular deve ter 9 dígitos e iniciar com 9.`);
  }
}

for (const [campo, valor] of Object.entries(config)) {
  if (typeof valor === "string" && parecePlaceholder(valor)) erros.push(`${campo}: contém valor de placeholder.`);
}

if (config.whatsappPrincipal) validarWhatsApp(config.whatsappPrincipal, "whatsappPrincipal");
else avisos.push("WhatsApp principal ainda não informado.");

if (config.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) erros.push("email: formato inválido.");

if (config.instagram) {
  const valor = String(config.instagram).trim();
  if (!valor.startsWith("@") && !/^https?:\/\/(www\.)?instagram\.com\//i.test(valor)) {
    erros.push("instagram: use @usuario ou URL oficial do Instagram.");
  }
} else avisos.push("Instagram oficial ainda não informado.");

if (!Array.isArray(config.vendedores)) {
  erros.push("vendedores deve ser uma lista.");
} else {
  config.vendedores.forEach((vendedor, index) => {
    if (!vendedor?.nome) erros.push(`vendedores[${index}]: nome ausente.`);
    if (!vendedor?.whatsapp) erros.push(`vendedores[${index}]: WhatsApp ausente.`);
    else {
      if (parecePlaceholder(vendedor.whatsapp)) erros.push(`vendedores[${index}]: WhatsApp é placeholder.`);
      validarWhatsApp(vendedor.whatsapp, `vendedores[${index}].whatsapp`);
    }
  });
}

console.log("Validação dos contatos públicos");
console.log("==============================");
if (avisos.length) {
  console.log("\nPendências:");
  avisos.forEach((aviso) => console.log(`- ${aviso}`));
}
if (erros.length) {
  console.error("\nErros:");
  erros.forEach((erro) => console.error(`- ${erro}`));
  process.exitCode = 1;
} else {
  console.log("\nNenhum dado inválido/placeholder encontrado.");
}
