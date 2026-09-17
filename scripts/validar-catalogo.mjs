import fs from "node:fs";

const produtosPath = new URL("../data/produtos.json", import.meta.url);
const importacaoPath = new URL(
  "../data/equipamentos-oficiais-importacao.json",
  import.meta.url
);

const catalogo = JSON.parse(fs.readFileSync(produtosPath, "utf8"));
const importacao = JSON.parse(fs.readFileSync(importacaoPath, "utf8"));

const produtos = catalogo.produtos ?? [];
const oficiais = produtos.filter(
  (produto) => produto.origem === "tabela-oficial"
);
const demonstrativos = produtos.filter(
  (produto) => produto.origem === "catalogo-demonstrativo"
);

function falhar(mensagem) {
  console.error(`ERRO: ${mensagem}`);
  process.exitCode = 1;
}

function duplicados(valores) {
  const contagem = new Map();

  for (const valor of valores) {
    contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
  }

  return [...contagem.entries()]
    .filter(([, quantidade]) => quantidade > 1)
    .sort(([a], [b]) => String(a).localeCompare(String(b)));
}

if (!Array.isArray(produtos)) {
  falhar("catalogo.produtos precisa ser um array.");
}

if (produtos.length !== 101) {
  falhar(`esperados 101 registros totais; encontrados ${produtos.length}.`);
}

if (oficiais.length !== 91) {
  falhar(`esperados 91 registros oficiais; encontrados ${oficiais.length}.`);
}

if (demonstrativos.length !== 10) {
  falhar(
    `esperados 10 registros demonstrativos; encontrados ${demonstrativos.length}.`
  );
}

const ativos = produtos.filter((produto) => produto.ativoNoSite === true);

if (ativos.length !== 10) {
  falhar(`esperados 10 produtos ativos; encontrados ${ativos.length}.`);
}

const idsDuplicados = duplicados(produtos.map((produto) => produto.id));

if (idsDuplicados.length > 0) {
  falhar(`IDs duplicados: ${JSON.stringify(idsDuplicados)}.`);
}

const slugsDuplicados = duplicados(produtos.map((produto) => produto.slug));

if (slugsDuplicados.length > 0) {
  falhar(`slugs duplicados: ${JSON.stringify(slugsDuplicados)}.`);
}

const codigosOficiais = oficiais.map((produto) => produto.codigo);
const codigosDistintos = new Set(codigosOficiais);

if (codigosDistintos.size !== 88) {
  falhar(
    `esperados 88 códigos oficiais distintos; encontrados ${codigosDistintos.size}.`
  );
}

const duplicidadesEsperadas = [
  ["2004784708006", 2],
  ["2048536878005", 2],
  ["2071725904407", 2]
];

const duplicidadesEncontradas = duplicados(codigosOficiais);

if (
  JSON.stringify(duplicidadesEncontradas) !==
  JSON.stringify(duplicidadesEsperadas)
) {
  falhar(
    `duplicidades de código divergentes: ${JSON.stringify(
      duplicidadesEncontradas
    )}.`
  );
}

if (importacao.totalLinhasEquipamentos !== 91) {
  falhar(
    `arquivo de importação declara ${importacao.totalLinhasEquipamentos} linhas em vez de 91.`
  );
}

if (importacao.totalCodigosDistintos !== 88) {
  falhar(
    `arquivo de importação declara ${importacao.totalCodigosDistintos} códigos distintos em vez de 88.`
  );
}

const contemCusto = produtos.some((produto) =>
  Object.prototype.hasOwnProperty.call(produto, "custo")
);

if (contemCusto) {
  falhar("data/produtos.json não pode expor o campo custo.");
}

if (!process.exitCode) {
  console.log("Catálogo validado com sucesso.");
  console.log(`Registros totais: ${produtos.length}`);
  console.log(`Oficiais: ${oficiais.length}`);
  console.log(`Demonstrativos preservados: ${demonstrativos.length}`);
  console.log(`Ativos no site: ${ativos.length}`);
  console.log(`Códigos oficiais distintos: ${codigosDistintos.size}`);
}
