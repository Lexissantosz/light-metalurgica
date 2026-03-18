const productDetailContainer = document.getElementById("productDetailContainer");

function obterParametroId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function buscarProdutoPorId(id) {
  if (!Array.isArray(produtos)) return null;
  return produtos.find((produto) => produto.id === id) || null;
}

function criarImagemDetalhe(produto) {
  if (produto.imagem && produto.imagem.trim() !== "") {
    return `
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
        onerror="this.outerHTML='<div class=&quot;product-detail-placeholder&quot;>Imagem indisponível</div>'"
      />
    `;
  }

  return `<div class="product-detail-placeholder">Imagem indisponível</div>`;
}

function gerarMensagemWhatsApp(produto) {
  const texto = `Olá! Tenho interesse no equipamento ${produto.nome} e gostaria de solicitar um orçamento.`;
  return encodeURIComponent(texto);
}

function renderizarProdutoNaoEncontrado() {
  productDetailContainer.innerHTML = `
    <div class="product-not-found">
      <span class="section-badge">Produto</span>
      <h1>Produto não encontrado</h1>
      <p>O item solicitado não foi localizado no catálogo atual.</p>
      <div class="product-detail-actions" style="margin-top: 24px;">
        <a href="produtos.html" class="btn btn-gold">Voltar ao catálogo</a>
      </div>
    </div>
  `;
}

function renderizarProduto(produto) {
  const whatsappMensagem = gerarMensagemWhatsApp(produto);
  const numeroWhatsApp = "5561999999999";

  productDetailContainer.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-image-box">
        <div class="product-detail-image-wrap">
          ${criarImagemDetalhe(produto)}
        </div>
      </div>

      <div class="product-detail-info">
        <span class="product-detail-category">${produto.categoria}</span>
        <h1 class="product-detail-title">${produto.nome}</h1>
        <p class="product-detail-description">${produto.descricao}</p>

        <ul class="product-detail-list">
          <li>Equipamento com apresentação profissional para academias e estúdios.</li>
          <li>Estrutura pensada para resistência, estabilidade e presença visual.</li>
          <li>Ideal para compor espaços fitness com padrão mais sofisticado.</li>
        </ul>

        <div class="product-detail-actions">
          <a href="contato.html" class="btn btn-gold">Solicitar orçamento</a>
          <a
            href="https://wa.me/${numeroWhatsApp}?text=${whatsappMensagem}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline"
          >
            Chamar no WhatsApp
          </a>
          <a href="produtos.html" class="btn btn-outline">Voltar ao catálogo</a>
        </div>
      </div>
    </div>
  `;

  document.title = `${produto.nome} | Light Metalúrgica`;
}

function iniciarPaginaProduto() {
  if (!productDetailContainer) return;

  const id = obterParametroId();
  const produto = buscarProdutoPorId(id);

  if (!id || !produto) {
    renderizarProdutoNaoEncontrado();
    return;
  }

  renderizarProduto(produto);
}

iniciarPaginaProduto();