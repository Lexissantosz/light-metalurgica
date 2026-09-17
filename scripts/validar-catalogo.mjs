import fs from "node:fs";

const produtosPath = new URL("../data/produtos.json", import.meta.url);
const importacaoPath = new URL(
  "../data/equipamentos-oficiais-importacao.json",
  import.meta.url
);

const catalogo = JSON.parse(fs.readFileSync(produtosPath, "utf8"));
const importacao = JSON.parse(fs.readFileSync(importacaoPath, "utf8"));

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

function normalizarDuplicidadesFonte(itens = []) {
  return itens
    .map((item) => [String(item.codigo), Number(item.quantidade)])
    .sort(([a], [b]) => a.localeCompare(b));
}

const produtos = catalogo.produtos;
const equipamentosImportacao = importacao.equipamentos;

if (!Array.isArray(produtos)) {
  console.error("ERRO: catalogo.produtos precisa ser um array.");
  process.exit(1);
}

if (!Array.isArray(equipamentosImportacao)) {
  console.error("ERRO: importacao.equipamentos precisa ser um array.");
  process.exit(1);
}

const oficiais = produtos.filter(
  (produto) => produto.origem === "tabela-oficial"
);
const demonstrativos = produtos.filter(
  (produto) => produto.origem === "catalogo-demonstrativo"
);
const ativos = produtos.filter((produto) => produto.ativoNoSite === true);

if (importacao.totalLinhasEquipamentos !== equipamentosImportacao.length) {
  falhar(
    `o arquivo de importação declara ${importacao.totalLinhasEquipamentos} linhas, mas contém ${equipamentosImportacao.length} equipamentos.`
  );
}

if (oficiais.length !== equipamentosImportacao.length) {
  falhar(
    `esperados ${equipamentosImportacao.length} registros oficiais; encontrados ${oficiais.length}.`
  );
}

if (produtos.length < oficiais.length) {
  falhar("o catálogo possui menos produtos do que registros oficiais.");
}

const idsDuplicados = duplicados(produtos.map((produto) => produto.id));

if (idsDuplicados.length > 0) {
  falhar(`IDs duplicados: ${JSON.stringify(idsDuplicados)}.`);
}

const slugsDuplicados = duplicados(produtos.map((produto) => produto.slug));

if (slugsDuplicados.length > 0) {
  falhar(`slugs duplicados: ${JSON.stringify(slugsDuplicados)}.`);
}

const produtosSemIdentidade = produtos.filter(
  (produto) =>
    !Number.isInteger(produto.id) ||
    typeof produto.nome !== "string" ||
    produto.nome.trim() === "" ||
    typeof produto.slug !== "string" ||
    produto.slug.trim() === ""
);

if (produtosSemIdentidade.length > 0) {
  falhar(
    `${produtosSemIdentidade.length} produto(s) possuem id, nome ou slug inválido(s).`
  );
}

const ativosSemImagem = ativos.filter(
  (produto) => typeof produto.imagem !== "string" || produto.imagem.trim() === ""
);

if (ativosSemImagem.length > 0) {
  falhar(
    `produtos ativos sem imagem: ${ativosSemImagem
      .map((produto) => `${produto.id}:${produto.nome}`)
      .join(", ")}.`
  );
}

const precosPublicosInvalidos = produtos.filter(
  (produto) =>
    produto.exibirPreco === true &&
    (!Number.isFinite(produto.precoPublico) || produto.precoPublico <= 0)
);

if (precosPublicosInvalidos.length > 0) {
  falhar(
    `produtos com preço público inválido: ${precosPublicosInvalidos
      .map((produto) => `${produto.id}:${produto.nome}`)
      .join(", ")}.`
  );
}

const contemCusto = produtos.some((produto) =>
  Object.prototype.hasOwnProperty.call(produto, "custo")
);

if (contemCusto) {
  falhar("data/produtos.json não pode expor o campo custo.");
}

const codigosOficiais = oficiais.map((produto) => produto.codigo);
const codigosDistintos = new Set(codigosOficiais);

if (codigosDistintos.size !== importacao.totalCodigosDistintos) {
  falhar(
    `esperados ${importacao.totalCodigosDistintos} códigos oficiais distintos; encontrados ${codigosDistintos.size}.`
  );
}

const codigosOficiaisInvalidos = oficiais.filter(
  (produto) =>
    typeof produto.codigo !== "string" || !/^\d{13}$/.test(produto.codigo)
);

if (codigosOficiaisInvalidos.length > 0) {
  falhar(
    `códigos oficiais inválidos: ${codigosOficiaisInvalidos
      .map((produto) => `${produto.id}:${produto.codigo}`)
      .join(", ")}.`
  );
}

const duplicidadesEsperadas = normalizarDuplicidadesFonte(
  importacao.codigosDuplicados
);
const duplicidadesEncontradas = duplicados(codigosOficiais);

if (
  JSON.stringify(duplicidadesEncontradas) !==
  JSON.stringify(duplicidadesEsperadas)
) {
  falhar(
    `duplicidades de código divergentes: ${JSON.stringify(
      duplicidadesEncontradas
    )}. Esperado: ${JSON.stringify(duplicidadesEsperadas)}.`
  );
}

const oficiaisPorOrdem = new Map(
  oficiais.map((produto) => [produto.ordemFonte, produto])
);

for (const itemFonte of equipamentosImportacao) {
  const produto = oficiaisPorOrdem.get(itemFonte.ordemFonte);

  if (!produto) {
    falhar(`registro oficial ausente para ordemFonte ${itemFonte.ordemFonte}.`);
    continue;
  }

  if (produto.codigo !== itemFonte.codigo) {
    falhar(
      `código divergente na ordem ${itemFonte.ordemFonte}: ${produto.codigo} != ${itemFonte.codigo}.`
    );
  }

  if (produto.nomeOriginal !== itemFonte.nomeOriginal) {
    falhar(
      `nome original divergente na ordem ${itemFonte.ordemFonte}: ${produto.nomeOriginal} != ${itemFonte.nomeOriginal}.`
    );
  }
}

if (!process.exitCode) {
  console.log("Catálogo validado com sucesso.");
  console.log(`Registros totais: ${produtos.length}`);
  console.log(`Oficiais: ${oficiais.length}`);
  console.log(`Demonstrativos preservados: ${demonstrativos.length}`);
  console.log(`Ativos no site: ${ativos.length}`);
  console.log(`Códigos oficiais distintos: ${codigosDistintos.size}`);
}
