const productsGrid = document.getElementById("productsGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const resultsInfo = document.getElementById("resultsInfo");
const emptyState = document.getElementById("emptyState");
const catalogTotalProducts = document.getElementById("catalogTotalProducts");
const catalogTotalCategories = document.getElementById("catalogTotalCategories");

let produtos = [];
let categoriaAtual = "Todos";
let termoBusca = "";

function carregarRefinoCatalogo() {
  if (document.querySelector('link[data-catalog-refine="true"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/catalogo-refino.css";
  link.dataset.catalogRefine = "true";
  document.head.appendChild(link);
}

function escaparHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizarTexto(texto = "") {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterCategorias() {
  const categorias = [...new Set(produtos.map((produto) => produto.categoria))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  return ["Todos", ...categorias];
}

function atualizarEstatisticasCatalogo() {
  if (catalogTotalProducts) {
    catalogTotalProducts.textContent = String(produtos.length).padStart(2, "0");
  }

  if (catalogTotalCategories) {
    const totalCategorias = new Set(
      produtos.map((produto) => produto.categoria).filter(Boolean)
    ).size;

    catalogTotalCategories.textContent = String(totalCategorias).padStart(2, "0");
  }
}

function criarFiltros() {
  if (!categoryFilters) return;

  const categorias = obterCategorias();

  categoryFilters.innerHTML = categorias
    .map((categoria) => {
      const ativa = categoria === categoriaAtual;

      return `
        <button
          class="filter-btn ${ativa ? "active" : ""}"
          data-category="${escaparHtml(categoria)}"
          type="button"
          aria-pressed="${ativa}"
        >
          ${escaparHtml(categoria)}
        </button>
      `;
    })
    .join("");

  categoryFilters.querySelectorAll(".filter-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      categoriaAtual = botao.dataset.category || "Todos";
      criarFiltros();
      renderizarProdutos();
    });
  });
}

function produtoCorrespondeBusca(produto) {
  const termo = normalizarTexto(termoBusca.trim());
  if (!termo) return true;

  const campos = [
    produto.nome,
    produto.categoria,
    produto.descricaoCurta,
    produto.codigo
  ];

  return campos.some((campo) => normalizarTexto(campo).includes(termo));
}

function filtrarProdutos() {
  return produtos.filter((produto) => {
    const correspondeCategoria =
      categoriaAtual === "Todos" || produto.categoria === categoriaAtual;

    return correspondeCategoria && produtoCorrespondeBusca(produto);
  });
}

function criarImagemProduto(produto) {
  if (produto.imagem && produto.imagem.trim() !== "") {
    return `
      <img
        src="${escaparHtml(produto.imagem)}"
        alt="${escaparHtml(produto.nome)}"
        loading="lazy"
        decoding="async"
      />
    `;
  }

  return `
    <div class="catalog-card-placeholder" role="img" aria-label="Imagem indisponível">
      Imagem indisponível
    </div>
  `;
}

function criarCardProduto(produto) {
  const nome = escaparHtml(produto.nome);
  const categoria = escaparHtml(produto.categoria);
  const descricao = escaparHtml(
    produto.descricaoCurta || "Informações comerciais disponíveis sob consulta."
  );
  const linkProduto = `produto.html?id=${produto.id}`;
  const linkOrcamento = `contato.html?produto=${encodeURIComponent(produto.nome)}`;

  return `
    <article class="catalog-card">
      <a
        href="${linkProduto}"
        class="catalog-card-image"
        aria-label="Ver detalhes de ${nome}"
      >
        ${criarImagemProduto(produto)}
      </a>

      <div class="catalog-card-content">
        <span class="catalog-card-category">${categoria}</span>

        <h3 class="catalog-card-title">
          <a href="${linkProduto}">${nome}</a>
        </h3>

        <p class="catalog-card-description">${descricao}</p>

        <div class="catalog-card-actions">
          <a href="${linkProduto}" class="btn btn-outline">
            Ver detalhes
          </a>

          <a href="${linkOrcamento}" class="btn btn-gold">
            Solicitar orçamento
          </a>
        </div>
      </div>
    </article>
  `;
}

function atualizarInfoResultados(total) {
  if (!resultsInfo) return;

  const palavraProduto = total === 1 ? "produto" : "produtos";
  const usandoFiltro = categoriaAtual !== "Todos" || termoBusca.trim() !== "";

  resultsInfo.textContent = usandoFiltro
    ? `${total} ${palavraProduto} encontrado${total === 1 ? "" : "s"}.`
    : `${total} ${palavraProduto} no catálogo.`;
}

function renderizarProdutos() {
  if (!productsGrid) return;

  const produtosFiltrados = filtrarProdutos();
  atualizarInfoResultados(produtosFiltrados.length);

  if (produtosFiltrados.length === 0) {
    productsGrid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  productsGrid.innerHTML = produtosFiltrados
    .map(criarCardProduto)
    .join("");
}

function renderizarErroCatalogo() {
  if (productsGrid) productsGrid.innerHTML = "";

  if (resultsInfo) {
    resultsInfo.textContent = "Não foi possível carregar o catálogo.";
  }

  if (emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.innerHTML = `
      <span>Erro de carregamento</span>
      <h3>Não foi possível carregar os equipamentos.</h3>
      <p>Tente atualizar a página novamente.</p>
    `;
  }
}

async function iniciarCatalogo() {
  try {
    if (!window.catalogoData) {
      throw new Error("Módulo de catálogo indisponível.");
    }

    produtos = await window.catalogoData.carregarProdutosPublicos();

    atualizarEstatisticasCatalogo();
    criarFiltros();
    renderizarProdutos();
  } catch (erro) {
    console.error("Erro ao carregar catálogo:", erro);
    renderizarErroCatalogo();
  }
}

carregarRefinoCatalogo();

if (resultsInfo) {
  resultsInfo.setAttribute("aria-live", "polite");
  resultsInfo.setAttribute("aria-atomic", "true");
}

if (searchInput) {
  searchInput.setAttribute(
    "aria-label",
    "Buscar equipamento por nome, categoria, descrição ou código"
  );

  searchInput.addEventListener("input", (event) => {
    termoBusca = event.target.value;
    renderizarProdutos();
  });
}

iniciarCatalogo();
