const homeCatalogCount =
  document.getElementById("homeCatalogCount");

const homeHeroImage =
  document.getElementById("homeHeroImage");

const homeHeroName =
  document.getElementById("homeHeroName");

const homeHeroLink =
  document.getElementById("homeHeroLink");

const homeFeaturedProducts =
  document.getElementById("homeFeaturedProducts");


function obterDestaquesHome(produtos) {
  return produtos
    .filter(
      (produto) =>
        Number(produto.destaqueHome) > 0
    )
    .sort(
      (a, b) =>
        Number(a.destaqueHome) -
        Number(b.destaqueHome)
    );
}


function criarImagemProduto(produto, destaque = false) {
  if (!produto.imagem) {
    return `
      <div class="product-image-placeholder">
        Imagem indisponível
      </div>
    `;
  }

  return `
    <img
      src="${produto.imagem}"
      alt="${produto.nome}"
      ${destaque ? 'fetchpriority="high"' : 'loading="lazy"'}
    />
  `;
}


function atualizarHero(produto) {
  if (!produto) return;

  if (homeHeroImage) {
    homeHeroImage.innerHTML =
      criarImagemProduto(produto, true);
  }

  if (homeHeroName) {
    homeHeroName.textContent =
      produto.nome;
  }

  if (homeHeroLink) {
    homeHeroLink.href =
      `produto.html?id=${produto.id}`;
  }
}


function criarCardDestaque(produto, index) {
  const numero =
    String(index + 1).padStart(2, "0");

  const classePrincipal =
    index === 0
      ? " product-showcase-main"
      : "";

  return `
    <article class="product-showcase${classePrincipal}">

      <a
        href="produto.html?id=${produto.id}"
        class="product-showcase-image"
      >

        <span class="product-code">
          ${numero} / ${produto.categoria.toUpperCase()}
        </span>

        ${criarImagemProduto(produto)}

      </a>

      <div class="product-showcase-info">

        <div>
          <span>${produto.categoria}</span>
          <h3>${produto.nome}</h3>
        </div>

        <a
          href="produto.html?id=${produto.id}"
          class="text-link"
        >
          Ver equipamento
        </a>

      </div>

    </article>
  `;
}


function renderizarDestaques(produtos) {
  const destaques =
    obterDestaquesHome(produtos);

  atualizarHero(destaques[0]);

  if (!homeFeaturedProducts) {
    return;
  }

  homeFeaturedProducts.innerHTML =
    destaques
      .map(criarCardDestaque)
      .join("");
}


async function iniciarHome() {
  try {
    const produtos =
      await window.catalogoData
        .carregarProdutosPublicos();

    if (homeCatalogCount) {
      homeCatalogCount.textContent =
        `${produtos.length} equipamentos no catálogo`;
    }

    renderizarDestaques(produtos);
  } catch (erro) {
    console.error(
      "Erro ao carregar dados da Home:",
      erro
    );

    if (homeCatalogCount) {
      homeCatalogCount.textContent =
        "Catálogo disponível online";
    }
  }
}


iniciarHome();