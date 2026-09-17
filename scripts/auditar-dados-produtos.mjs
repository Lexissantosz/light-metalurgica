import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const arquivo = path.join(root, "data", "produtos.json");

const catalogo = JSON.parse(fs.readFileSync(arquivo, "utf8"));
const produtos = Array.isArray(catalogo.produtos) ? catalogo.produtos : [];

if (!produtos.length) {
  throw new Error("Catálogo sem produtos para auditoria.");
}

const camposTecnicos = [
  "dimensoes",
  "capacidade",
  "estrutura",
  "acabamento",
  "personalizacao",
  "garantia"
];

const erros = [];
const cobertura = Object.fromEntries(camposTecnicos.map((campo) => [campo, 0]));
let finalidadePreenchida = 0;
let precoPublicoAutorizado = 0;
let imagemDisponivel = 0;

for (const produto of produtos) {
  const prefixo = `ID ${produto.id ?? "?"} (${produto.nome ?? "sem nome"})`;

  if (!Number.isInteger(produto.id) || produto.id <= 0) {
    erros.push(`${prefixo}: id inválido.`);
  }

  if (!produto.nome || !produto.slug || !produto.categoria || !produto.descricaoCurta) {
    erros.push(`${prefixo}: campos públicos obrigatórios ausentes.`);
  }

  if (produto.ativoNoSite === true && !produto.imagem) {
    erros.push(`${prefixo}: produto ativo sem imagem.`);
  }

  if (produto.exibirPreco === true) {
    if (typeof produto.precoPublico !== "number" || produto.precoPublico <= 0) {
      erros.push(`${prefixo}: exibirPreco=true sem precoPublico válido.`);
    } else {
      precoPublicoAutorizado += 1;
    }
  }

  if (produto.imagem) imagemDisponivel += 1;
  if (typeof produto.finalidade === "string" && produto.finalidade.trim()) {
    finalidadePreenchida += 1;
  }

  for (const campo of camposTecnicos) {
    const valor = produto.especificacoes?.[campo];
    if (typeof valor === "string" && valor.trim()) {
      cobertura[campo] += 1;
    }
  }
}

const ids = produtos.map((produto) => produto.id);
if (new Set(ids).size !== ids.length) {
  erros.push("Existem IDs internos duplicados.");
}

const slugs = produtos.map((produto) => produto.slug);
if (new Set(slugs).size !== slugs.length) {
  erros.push("Existem slugs duplicados.");
}

console.log("\nAuditoria de dados do catálogo");
console.log("============================");
console.log(`Produtos: ${produtos.length}`);
console.log(`Com imagem: ${imagemDisponivel}/${produtos.length}`);
console.log(`Com finalidade detalhada: ${finalidadePreenchida}/${produtos.length}`);
console.log(`Com preço público autorizado: ${precoPublicoAutorizado}/${produtos.length}`);

for (const campo of camposTecnicos) {
  console.log(`Com ${campo}: ${cobertura[campo]}/${produtos.length}`);
}

if (erros.length) {
  console.error("\nErros bloqueantes:");
  for (const erro of erros) console.error(`- ${erro}`);
  process.exitCode = 1;
} else {
  console.log("\nNenhum erro estrutural bloqueante encontrado.");
  console.log("Campos técnicos ausentes são tratados como dados pendentes, não como informação a inventar.");
}
