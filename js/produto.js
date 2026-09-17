const productDetailContainer =
  document.getElementById("productDetailContainer");

const relatedProductsContainer =
  document.getElementById("relatedProducts");

const relatedSection =
  document.getElementById("relatedSection");

const breadcrumbProduct =
  document.getElementById("breadcrumbProduct");


function obterParametroId() {
  const params =
    new URLSearchParams(window.location.search);

  return Number(params.get("id"));
}

let produtos = [];

function buscarProdutoPorId(id) {
  if (
    typeof produtos === "undefined" ||
    !Array.isArray(produtos)
  ) {
    return null;
  }

  return (
    produtos.find(
      (produto) =>
        produto.id === id
    ) || null
  );
}


function formatarNumeroProduto(id) {
  return String(id).padStart(2, "0");
}


function criarImagemDetalhe(produto) {
  if (
    produto.imagem &&
    produto.imagem.trim() !== ""
  ) {
    return `
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        fetchpriority="high"
        onerror="
          this.outerHTML =
          '<div class=&quot;product-detail-placeholder&quot;>Imagem indisponível</div>'
        "
      />
    `;
  }

  return `
    <div class="product-detail-placeholder">
      Imagem indisponível
    </div>
  `;
}


function criarLinkOrcamento(produto) {
  return `contato.html?produto=${encodeURIComponent(
    produto.nome
  )}`;
}


function renderizarProdutoNaoEncontrado() {

  productDetailContainer.innerHTML = `
    <div class="product-not-found">

      <span class="section-badge">
        Equipamento
      </span>

      <h1>
        Produto não encontrado.
      </h1>

      <p>
        O equipamento solicitado não foi localizado
        no catálogo atual da Light Metalúrgica.
      </p>

      <a
        href="produtos.html"
        class="btn btn-gold"
      >
        Voltar ao catálogo
      </a>

    </div>
  `;

  if (relatedSection) {
    relatedSection.style.display =
      "none";
  }
}


function renderizarProduto(produto) {

  const numero =
    formatarNumeroProduto(
      produto.id
    );

  const linkOrcamento =
    criarLinkOrcamento(
      produto
    );


  productDetailContainer.innerHTML = `

    <div class="product-detail-layout">

      <!-- IMAGEM -->

      <div class="product-detail-image-box">

        <div class="product-detail-image-head">

          <span>
            LIGHT / EQUIPMENT
          </span>

          <strong>
            ${numero}
          </strong>

        </div>

        <div class="product-detail-image-wrap">

          ${criarImagemDetalhe(
            produto
          )}

        </div>

      </div>


      <!-- INFORMAÇÕES -->

      <div class="product-detail-info">

        <div class="product-index">

          <span>
            Catálogo Light
          </span>

          <strong>
            ${numero}
          </strong>

        </div>

        <span class="product-detail-category">
          ${produto.categoria}
        </span>

        <h1 class="product-detail-title">
          ${produto.nome}
        </h1>

        <p class="product-detail-description">
          ${produto.descricaoCurta}
        </p>


        <div class="product-characteristics">

  ${
    Array.isArray(produto.destaques)
      ? produto.destaques
          .map(
            (destaque, index) => `
              <article class="product-characteristic">

                <span class="product-characteristic-number">
                  ${String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>
                    ${destaque.titulo}
                  </h3>

                  <p>
                    ${destaque.texto}
                  </p>
                </div>

              </article>
            `
          )
          .join("")
      : ""
  }

</div>


        <div class="product-detail-actions">

          <a
            href="${linkOrcamento}"
            class="btn btn-gold"
          >
            Solicitar orçamento
            <span aria-hidden="true">
              →
            </span>
          </a>

          <a
            href="produtos.html"
            class="btn btn-outline"
          >
            Voltar ao catálogo
          </a>

        </div>

      </div>

    </div>
  `;


  document.title =
    `${produto.nome} | Light Metalúrgica`;


  if (breadcrumbProduct) {
    breadcrumbProduct.textContent =
      produto.nome;
  }
}


function obterRelacionados(produto) {

  const mesmaCategoria =
    produtos.filter(
      (item) =>
        item.categoria === produto.categoria &&
        item.id !== produto.id
    );


  const outrasCategorias =
    produtos.filter(
      (item) =>
        item.categoria !== produto.categoria &&
        item.id !== produto.id
    );


  return [
    ...mesmaCategoria,
    ...outrasCategorias
  ].slice(0, 3);
}


function criarCardRelacionado(produto) {

  return `
    <article class="related-product-card">

      <a
        href="produto.html?id=${produto.id}"
        class="related-product-image"
      >

        <img
          src="${produto.imagem}"
          alt="${produto.nome}"
          loading="lazy"
        />

      </a>


      <div class="related-product-info">

        <span>
          ${produto.categoria}
        </span>

        <h3>
          ${produto.nome}
        </h3>

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


function renderizarRelacionados(produto) {

  if (
    !relatedProductsContainer
  ) {
    return;
  }


  const relacionados =
    obterRelacionados(
      produto
    );


  if (
    relacionados.length === 0
  ) {
    if (relatedSection) {
      relatedSection.style.display =
        "none";
    }

    return;
  }


  relatedProductsContainer.innerHTML =
    relacionados
      .map(
        criarCardRelacionado
      )
      .join("");
}


function iniciarPaginaProduto() {

  if (
    !productDetailContainer
  ) {
    return;
  }


  const id =
    obterParametroId();


  const produto =
    buscarProdutoPorId(
      id
    );


  if (
    !id ||
    !produto
  ) {
    renderizarProdutoNaoEncontrado();

    return;
  }


  renderizarProduto(
    produto
  );


  renderizarRelacionados(
    produto
  );
}


async function carregarPaginaProduto() {
  try {
    produtos =
      await window.catalogoData
        .carregarProdutosPublicos();

    iniciarPaginaProduto();
  } catch (erro) {
    console.error(
      "Erro ao carregar produto:",
      erro
    );

    renderizarProdutoNaoEncontrado();
  }
}

carregarPaginaProduto();