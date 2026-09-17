const digitalCatalogGrid = document.getElementById("digitalCatalogGrid");
const productCount = document.getElementById("digitalCatalogProductCount");
const categoryCount = document.getElementById("digitalCatalogCategoryCount");
const updatedAt = document.getElementById("digitalCatalogUpdatedAt");
const pdfLink = document.getElementById("catalogPdfLink");
const pdfStatus = document.getElementById("catalogPdfStatus");

function formatarDataIso(dataIso) {
  if (!dataIso) return "Sob consulta";

  const [ano, mes, dia] = dataIso.split("-");
  if (!ano || !mes || !dia) return dataIso;

  return `${dia}/${mes}/${ano}`;
}

function escaparHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function criarCardCatalogoDigital(produto) {
  const imagem = produto.imagem
    ? `
      <img
        src="${escaparHtml(produto.imagem)}"
        alt="${escaparHtml(produto.nome)}"
        loading="lazy"
        decoding="async"
      />
    `
    : `<div class="digital-catalog-loading">Imagem em preparação</div>`;

  return `
    <article class="digital-catalog-card">
      <a
        href="produto.html?id=${produto.id}"
        class="digital-catalog-card-image"
        aria-label="Ver ${escaparHtml(produto.nome)}"
      >
        ${imagem}
      </a>

      <div class="digital-catalog-card-content">
        <span>${escaparHtml(produto.categoria)}</span>
        <h3>${escaparHtml(produto.nome)}</h3>
        <p>${escaparHtml(produto.descricaoCurta || "Informações sob consulta.")}</p>
        <a href="produto.html?id=${produto.id}" class="text-link">Ver equipamento</a>
      </div>
    </article>
  `;
}

async function verificarPdf() {
  if (!pdfLink || !pdfStatus) return;

  try {
    const resposta = await fetch(pdfLink.href, {
      method: "HEAD",
      cache: "no-store"
    });

    if (!resposta.ok) throw new Error("PDF indisponível");

    pdfLink.classList.remove("is-disabled");
    pdfLink.removeAttribute("aria-disabled");
    pdfLink.textContent = "Baixar catálogo em PDF";
    pdfLink.setAttribute("download", "catalogo-light-metalurgica.pdf");
    pdfStatus.textContent = "A versão em PDF está disponível para download.";
  } catch (erro) {
    pdfLink.classList.add("is-disabled");
    pdfLink.setAttribute("aria-disabled", "true");
    pdfLink.removeAttribute("download");
    pdfLink.textContent = "PDF em preparação";
    pdfStatus.textContent =
      "A versão online já está disponível. O PDF será liberado nesta mesma página quando estiver pronto.";
  }
}

async function iniciarCatalogoDigital() {
  if (!window.catalogoData || !digitalCatalogGrid) return;

  try {
    const catalogo = await window.catalogoData.carregarCatalogo();
    const produtosPublicos = catalogo.produtos.filter(
      (produto) => produto.ativoNoSite === true
    );

    if (productCount) {
      productCount.textContent = String(produtosPublicos.length).padStart(2, "0");
    }

    if (categoryCount) {
      const categorias = new Set(produtosPublicos.map((produto) => produto.categoria));
      categoryCount.textContent = String(categorias.size).padStart(2, "0");
    }

    if (updatedAt) {
      updatedAt.textContent = formatarDataIso(catalogo.atualizadoEm);
    }

    if (produtosPublicos.length === 0) {
      digitalCatalogGrid.innerHTML = `
        <p class="digital-catalog-error">
          Nenhum equipamento público está disponível neste momento.
        </p>
      `;
      return;
    }

    digitalCatalogGrid.innerHTML = produtosPublicos
      .map(criarCardCatalogoDigital)
      .join("");
  } catch (erro) {
    console.error("Erro ao carregar catálogo digital:", erro);

    digitalCatalogGrid.innerHTML = `
      <p class="digital-catalog-error">
        Não foi possível carregar o catálogo digital. Tente atualizar a página.
      </p>
    `;
  }
}

verificarPdf();
iniciarCatalogoDigital();
