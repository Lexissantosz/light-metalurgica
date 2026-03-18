const productsGrid = document.getElementById("productsGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const resultsInfo = document.getElementById("resultsInfo");
const emptyState = document.getElementById("emptyState");

let categoriaAtual = "Todos";
let termoBusca = "";

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterCategorias() {
  const categorias = produtos.map((produto) => produto.categoria);
  return ["Todos", ...new Set(categorias)];
}

function criarFiltros() {
  const categorias = obterCategorias();

  categoryFilters.innerHTML = categorias
    .map(
      (categoria) => `
        <button
          class="filter-btn ${categoria === categoriaAtual ? "active" : ""}"
          data-category="${categoria}"
          type="button"
        >
          ${categoria}
        </button>
      `
    )
    .join("");

  const botoesFiltro = categoryFilters.querySelectorAll(".filter-btn");

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      categoriaAtual = botao.dataset.category;
      criarFiltros();
      renderizarProdutos();
    });
  });
}

function filtrarProdutos() {
  return produtos.filter((produto) => {
    const correspondeCategoria =
      categoriaAtual === "Todos" || produto.categoria === categoriaAtual;

    const correspondeBusca =
      termoBusca.trim() === "" ||
      normalizarTexto(produto.nome).includes(normalizarTexto(termoBusca));

    return correspondeCategoria && correspondeBusca;
  });
}

function criarImagemProduto(produto) {
  if (produto.imagem && produto.imagem.trim() !== "") {
    return `
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
        onerror="this.outerHTML='<div class=&quot;catalog-card-placeholder&quot;>Imagem indisponível</div>'"
      />
    `;
  }

  return `<div class="catalog-card-placeholder">Imagem indisponível</div>`;
}

function criarCardProduto(produto) {
  return `
    <article class="catalog-card">
      <div class="catalog-card-image">
        ${criarImagemProduto(produto)}
      </div>

      <div class="catalog-card-content">
        <span class="catalog-card-category">${produto.categoria}</span>
        <h3 class="catalog-card-title">${produto.nome}</h3>
        <p class="catalog-card-description">${produto.descricao}</p>

        <div class="catalog-card-actions">
          <a href="produto.html?id=${produto.id}" class="btn btn-outline">Ver detalhes</a>
          <a href="contato.html" class="btn btn-gold">Solicitar orçamento</a>
        </div>
      </div>
    </article>
  `;
}

function atualizarInfoResultados(total) {
  if (categoriaAtual === "Todos" && termoBusca.trim() === "") {
    resultsInfo.textContent = `${total} produto(s) exibido(s) no catálogo.`;
    return;
  }

  resultsInfo.textContent = `${total} produto(s) encontrado(s).`;
}

function renderizarProdutos() {
  if (!productsGrid) return;

  const produtosFiltrados = filtrarProdutos();

  atualizarInfoResultados(produtosFiltrados.length);

  if (produtosFiltrados.length === 0) {
    productsGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  productsGrid.innerHTML = produtosFiltrados
    .map((produto) => criarCardProduto(produto))
    .join("");
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    termoBusca = event.target.value;
    renderizarProdutos();
  });
}

if (typeof produtos !== "undefined" && Array.isArray(produtos)) {
  criarFiltros();
  renderizarProdutos();
} else {
  if (resultsInfo) {
    resultsInfo.textContent = "Erro ao carregar os produtos.";
  }
}