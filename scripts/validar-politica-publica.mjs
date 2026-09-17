import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const catalogo = JSON.parse(
  fs.readFileSync(path.join(root, "data", "produtos.json"), "utf8")
);

const produtos = Array.isArray(catalogo.produtos) ? catalogo.produtos : [];
const erros = [];
const avisos = [];

const ids = new Set();
const contagemCodigos = new Map();

for (const produto of produtos) {
  if (!Number.isInteger(produto.id) || produto.id <= 0) {
    erros.push(`ID inválido em ${produto.nome ?? "produto sem nome"}.`);
  } else if (ids.has(produto.id)) {
    erros.push(`ID interno duplicado: ${produto.id}.`);
  } else {
    ids.add(produto.id);
  }

  if (Object.hasOwn(produto, "custo")) {
    erros.push(`Campo público proibido 'custo' encontrado no ID ${produto.id}.`);
  }

  if (produto.exibirPreco === true) {
    if (typeof produto.precoPublico !== "number" || produto.precoPublico <= 0) {
      erros.push(
        `ID ${produto.id}: exibirPreco=true exige precoPublico numérico maior que zero.`
      );
    }
  }

  if (produto.codigo) {
    contagemCodigos.set(
      produto.codigo,
      (contagemCodigos.get(produto.codigo) ?? 0) + 1
    );
  }

  if (produto.categoriaValidada === false) {
    avisos.push(`ID ${produto.id}: categoria ainda não validada comercialmente.`);
  }
}

const duplicados = [...contagemCodigos.entries()]
  .filter(([, quantidade]) => quantidade > 1)
  .map(([codigo, quantidade]) => `${codigo} (${quantidade} registros)`);

console.log("Política pública do catálogo");
console.log("===========================");
console.log(`Produtos: ${produtos.length}`);
console.log(`IDs internos únicos: ${ids.size}`);
console.log(`Códigos comerciais duplicados: ${duplicados.length}`);

if (duplicados.length) {
  console.log("Duplicidades comerciais preservadas:");
  duplicados.forEach((item) => console.log(`- ${item}`));
}

const precosVisiveis = produtos.filter((produto) => produto.exibirPreco === true);
console.log(`Produtos com preço público habilitado: ${precosVisiveis.length}`);
console.log(`Categorias pendentes de validação: ${avisos.length}`);

if (erros.length) {
  console.error("\nErros bloqueantes:");
  erros.forEach((erro) => console.error(`- ${erro}`));
  process.exitCode = 1;
} else {
  console.log("\nPolítica pública válida: sem custo exposto e sem conflito de ID interno.");
}
