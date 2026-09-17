import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const erros = [];
const avisos = [];
const recursosGeradosOpcionais = new Set([
  "arquivos/catalogo-light-metalurgica.pdf"
]);

function existe(caminho) {
  return fs.existsSync(path.join(root, caminho));
}

function normalizarReferencia(valor) {
  if (!valor) return null;
  const limpa = valor.trim();
  if (
    !limpa ||
    limpa.startsWith("#") ||
    limpa.startsWith("http://") ||
    limpa.startsWith("https://") ||
    limpa.startsWith("mailto:") ||
    limpa.startsWith("tel:") ||
    limpa.startsWith("javascript:") ||
    limpa.startsWith("data:")
  ) {
    return null;
  }

  return limpa.split("#")[0].split("?")[0].replace(/^\.\//, "");
}

function listarHtml() {
  return fs
    .readdirSync(root)
    .filter((nome) => nome.endsWith(".html"))
    .sort();
}

function validarReferenciasHtml() {
  const atributo = /\b(?:href|src)=["']([^"']+)["']/g;

  for (const arquivo of listarHtml()) {
    const conteudo = fs.readFileSync(path.join(root, arquivo), "utf8");
    let match;

    while ((match = atributo.exec(conteudo))) {
      const referencia = normalizarReferencia(match[1]);
      if (!referencia) continue;

      if (!existe(referencia)) {
        if (recursosGeradosOpcionais.has(referencia)) {
          continue;
        }
        erros.push(`${arquivo}: referência local inexistente -> ${referencia}`);
      }
    }
  }
}

function validarCatalogo() {
  const arquivo = path.join(root, "data", "produtos.json");
  if (!fs.existsSync(arquivo)) {
    erros.push("data/produtos.json não encontrado.");
    return;
  }

  const catalogo = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  const produtos = Array.isArray(catalogo.produtos) ? catalogo.produtos : [];
  const ids = new Set();

  for (const produto of produtos) {
    if (ids.has(produto.id)) erros.push(`ID de produto duplicado: ${produto.id}`);
    ids.add(produto.id);

    if (produto.ativoNoSite === true) {
      if (!produto.imagem) {
        erros.push(`Produto público ${produto.id} sem imagem.`);
      } else {
        const imagem = produto.imagem.replace(/^\.\//, "");
        if (!existe(imagem)) {
          erros.push(`Produto público ${produto.id} aponta para imagem inexistente: ${imagem}`);
        }
      }
    }

    if (Object.hasOwn(produto, "custo")) {
      erros.push(`Produto ${produto.id} expõe o campo interno 'custo'.`);
    }

    if (
      produto.exibirPreco === true &&
      (typeof produto.precoPublico !== "number" || produto.precoPublico <= 0)
    ) {
      erros.push(`Produto ${produto.id} habilita preço sem valor público válido.`);
    }
  }
}

function validarPlaceholders() {
  const arquivos = [
    ...listarHtml(),
    "data/produtos.json",
    "data/contato.json"
  ].filter((arquivo) => existe(arquivo));

  const proibidos = [
    /\(61\)\s*99999-9999/g,
    /5561999999999/g,
    /99999[- ]?9999/g
  ];

  for (const arquivo of arquivos) {
    const conteudo = fs.readFileSync(path.join(root, arquivo), "utf8");
    for (const padrao of proibidos) {
      if (padrao.test(conteudo)) {
        erros.push(`${arquivo}: contém telefone placeholder.`);
      }
      padrao.lastIndex = 0;
    }
  }
}

function validarContatos() {
  const arquivo = path.join(root, "data", "contato.json");
  if (!fs.existsSync(arquivo)) {
    avisos.push("data/contato.json ainda não integrado à release.");
    return;
  }

  const contato = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  const vendedores = Array.isArray(contato.vendedores) ? contato.vendedores : [];
  const temCanal = Boolean(
    contato.whatsappPrincipal ||
      contato.instagram ||
      contato.email ||
      contato.telefone ||
      vendedores.some((vendedor) => vendedor?.whatsapp)
  );

  if (!temCanal) {
    erros.push("Release sem nenhum canal comercial confirmado em data/contato.json.");
  }
}

function validarRecursosDeCatalogo() {
  if (!existe("catalogo.html")) {
    avisos.push("catalogo.html ainda não integrado.");
  }

  if (!existe("arquivos/catalogo-light-metalurgica.pdf")) {
    avisos.push(
      "PDF final ainda não publicado em arquivos/catalogo-light-metalurgica.pdf; o gerador deve produzi-lo antes do teste manual."
    );
  }
}

validarReferenciasHtml();
validarCatalogo();
validarPlaceholders();
validarContatos();
validarRecursosDeCatalogo();

console.log("Release check — Light Metalúrgica");
console.log("=================================");

if (avisos.length) {
  console.log("\nAvisos:");
  avisos.forEach((aviso) => console.log(`- ${aviso}`));
}

if (erros.length) {
  console.error("\nErros bloqueantes:");
  erros.forEach((erro) => console.error(`- ${erro}`));
  process.exitCode = 1;
} else {
  console.log("\nNenhum erro automatizado bloqueante encontrado.");
}
