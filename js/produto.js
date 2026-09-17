const productDetailContainer = document.getElementById("productDetailContainer");
const relatedProductsContainer = document.getElementById("relatedProducts");
const relatedSection = document.getElementById("relatedSection");
const breadcrumbProduct = document.getElementById("breadcrumbProduct");
const finalQuoteLink = document.getElementById("finalQuoteLink");
const finalCtaProductName = document.getElementById("finalCtaProductName");

let produtos = [];

function obterParametroId() {
  const params = new URLSearchParams(window.location.search);
  const valor = params.get("id");

  if (!valor) return null;

  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function buscarProdutoPorId(id) {
  if (!Array.isArray(produtos)) return null;
  return produtos.find((produto) => produto.id === id) || null;
}

function formatarNumeroProduto(id) {
  return String(id).padStart(2, "0");
}

function escaparHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatarPreco(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return null;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor);
}

function criarImagemDetalhe(produto) {
  if (produto.imagem && produto.imagem.trim() !== "") {
    return `
      <img
        src="${escaparHtml(produto.imagem)}"
        alt="${escaparHtml(produto.nome)}"
        fetchpriority="high"
        decoding="async"
      />
    `;
  }

  return `
    <div class="product-detail-placeholder" role="img" aria-label="Imagem indisponível">
      <span>Imagem indisponível</span>
    </div>
  `;
}

function criarImagemRelacionado(produto) {
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
    <div class="related-product-placeholder" aria-hidden="true">
      Sem imagem
    </div>
  `;
}

function criarLinkOrcamento(produto) {
  return `contato.html?produto=${encodeURIComponent(produto.nome)}`;
}

function obterDestaques(produto) {
  if (Array.isArray(produto.destaques) && produto.destaques.length > 0) {
    return produto.destaques;
  }

  return [
    {
      titulo: "Aplicação",
      texto: `Equipamento da categoria ${produto.categoria}, destinado ao uso em academias, estúdios e espaços de musculação.`
    },
    {
      titulo: "Informações técnicas",
      texto: "Dimensões, capacidade, configuração e acabamento são informados pela equipe comercial conforme o modelo disponível."
    },
    {
      titulo: "Atendimento",
      texto: "Consulte disponibilidade, condições comerciais e detalhes do equipamento antes da compra."
    }
  ];
}

function criarFichaComercial(produto) {
  const preco = produto.exibirPreco === true ? formatarPreco(produto.precoPublico) : null;
  const codigo = produto.codigo ? escaparHtml(produto.codigo) : "Sob consulta";

  return `
    <div class="product-commercial-sheet" aria-label="Ficha comercial do equipamento">
      <div class="product-commercial-sheet-head">
        <span>Ficha comercial</span>
        <strong>Informações do modelo</strong>
      </div>

      <dl class="product-commercial-grid">
        <div>
          <dt>Categoria</dt>
          <dd>${escaparHtml(produto.categoria)}</dd>
        </div>

        <div>
          <dt>Código</dt>
          <dd>${codigo}</dd>
        </div>

        <div>
          <dt>Disponibilidade</dt>
          <dd>Sob consulta</dd>
        </div>

        <div>
          <dt>${preco ? "Valor" : "Orçamento"}</dt>
          <dd>${preco || "Personalizado"}</dd>
        </div>
      </dl>
    </div>
  `;
}

function renderizarDestaques(produto) {
  return obterDestaques(produto)
    .map(
      (destaque, index) => `
        <article class="product-characteristic">
          <span class="product-characteristic-number">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <h3>${escaparHtml(destaque.titulo)}</h3>
            <p>${escaparHtml(destaque.texto)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function atualizarMetadados(produto) {
  document.title = `${produto.nome} | Light Metalúrgica`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && produto.descricaoCurta) {
    metaDescription.setAttribute("content", produto.descricaoCurta);
  }
}

function atualizarCtaFinal(produto) {
  const linkOrcamento = criarLinkOrcamento(produto);

  if (finalQuoteLink) {
    finalQuoteLink.href = linkOrcamento;
  }

  if (finalCtaProductName) {
    finalCtaProductName.textContent = produto.nome;
  }
}

function renderizarProdutoNaoEncontrado() {
  productDetailContainer.innerHTML = `
    <div class="product-not-found">
      <span class="section-badge">Equipamento</span>
      <h1>Produto não encontrado.</h1>
      <p>
        O equipamento solicitado não foi localizado no catálogo público atual da
        Light Metalúrgica.
      </p>
      <a href="produtos.html" class="btn btn-gold">Voltar ao catálogo</a>
    </div>
  `;

  if (relatedSection) relatedSection.style.display = "none";
}

function renderizarProduto(produto) {
  const numero = formatarNumeroProduto(produto.id);
  const linkOrcamento = criarLinkOrcamento(produto);

  productDetailContainer.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-image-box">
        <div class="product-detail-image-head">
          <span>LIGHT / EQUIPMENT</span>
          <strong>${numero}</strong>
        </div>

        <div class="product-detail-image-wrap">
          ${criarImagemDetalhe(produto)}
        </div>
      </div>

      <div class="product-detail-info">
        <div class="product-index">
          <span>Catálogo Light</span>
          <strong>${numero}</strong>
        </div>

        <div class="product-detail-eyebrow">
          <span class="product-detail-category">${escaparHtml(produto.categoria)}</span>
          <span class="product-detail-status">Orçamento sob consulta</span>
        </div>

        <h1 class="product-detail-title">${escaparHtml(produto.nome)}</h1>

        <p class="product-detail-description">
          ${escaparHtml(produto.descricaoCurta || "Informações comerciais disponíveis sob consulta.")}
        </p>

        ${criarFichaComercial(produto)}

        <div class="product-characteristics">
          ${renderizarDestaques(produto)}
        </div>

        <div class="product-detail-actions">
          <a href="${linkOrcamento}" class="btn btn-gold">
            Solicitar orçamento deste modelo
            <span aria-hidden="true">→</span>
          </a>

          <a href="produtos.html" class="btn btn-outline">
            Voltar ao catálogo
          </a>
        </div>

        <p class="product-detail-note">
          Imagens ilustrativas. Informações técnicas, disponibilidade e condições
          comerciais devem ser confirmadas com a equipe da Light Metalúrgica.
        </p>
      </div>
    </div>
  `;

  atualizarMetadados(produto);
  atualizarCtaFinal(produto);

  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = produto.nome;
  }
}

function obterRelacionados(produto) {
  const mesmaCategoria = produtos.filter(
    (item) => item.categoria === produto.categoria && item.id !== produto.id
  );

  const outrasCategorias = produtos.filter(
    (item) => item.categoria !== produto.categoria && item.id !== produto.id
  );

  return [...mesmaCategoria, ...outrasCategorias].slice(0, 3);
}

function criarCardRelacionado(produto) {
  return `
    <article class="related-product-card">
      <a
        href="produto.html?id=${produto.id}"
        class="related-product-image"
        aria-label="Ver ${escaparHtml(produto.nome)}"
      >
        ${criarImagemRelacionado(produto)}
      </a>

      <div class="related-product-info">
        <span>${escaparHtml(produto.categoria)}</span>
        <h3>${escaparHtml(produto.nome)}</h3>
        <a href="produto.html?id=${produto.id}" class="text-link">
          Ver equipamento
        </a>
      </div>
    </article>
  `;
}

function renderizarRelacionados(produto) {
  if (!relatedProductsContainer) return;

  const relacionados = obterRelacionados(produto);

  if (relacionados.length === 0) {
    if (relatedSection) relatedSection.style.display = "none";
    return;
  }

  relatedProductsContainer.innerHTML = relacionados
    .map(criarCardRelacionado)
    .join("");
}

function iniciarPaginaProduto() {
  if (!productDetailContainer) return;

  const id = obterParametroId();
  const produto = id ? buscarProdutoPorId(id) : null;

  if (!produto) {
    renderizarProdutoNaoEncontrado();
    return;
  }

  renderizarProduto(produto);
  renderizarRelacionados(produto);
}

async function carregarPaginaProduto() {
  try {
    if (!window.catalogoData) {
      throw new Error("Módulo de catálogo indisponível.");
    }

    produtos = await window.catalogoData.carregarProdutosPublicos();
    iniciarPaginaProduto();
  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);
    renderizarProdutoNaoEncontrado();
  }
}

carregarPaginaProduto();
