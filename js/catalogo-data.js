async function carregarCatalogo() {
  const resposta = await fetch("./data/produtos.json");

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível carregar o catálogo. HTTP ${resposta.status}`
    );
  }

  const catalogo = await resposta.json();

  if (!catalogo || !Array.isArray(catalogo.produtos)) {
    throw new Error("Formato inválido em data/produtos.json");
  }

  return catalogo;
}

async function carregarProdutosPublicos() {
  const catalogo = await carregarCatalogo();

  return catalogo.produtos.filter(
    (produto) => produto.ativoNoSite === true
  );
}

window.catalogoData = {
  carregarCatalogo,
  carregarProdutosPublicos
};