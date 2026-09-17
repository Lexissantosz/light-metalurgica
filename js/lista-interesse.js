(() => {
  const STORAGE_KEY = "light-lista-interesse-v1";
  let feedbackTimer = null;

  function lerLista() {
    try {
      const valor = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(valor) ? valor : [];
    } catch {
      return [];
    }
  }

  function salvarLista(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    renderizarWidget();
    atualizarBotoesInline();
  }

  function normalizarItem(item) {
    return {
      id: Number(item.id),
      nome: String(item.nome || "Equipamento").trim()
    };
  }

  function contemId(id) {
    return lerLista().some((item) => Number(item.id) === Number(id));
  }

  function adicionarItem(item) {
    const normalizado = normalizarItem(item);
    if (!normalizado.id || contemId(normalizado.id)) return;

    const lista = lerLista();
    lista.push(normalizado);
    salvarLista(lista);
    mostrarFeedback(`${normalizado.nome} adicionado à lista.`);
  }

  function removerItem(id) {
    const lista = lerLista().filter((item) => Number(item.id) !== Number(id));
    salvarLista(lista);
  }

  function limparLista() {
    salvarLista([]);
    mostrarFeedback("Lista de interesse limpa.");
  }

  function escaparHtml(valor = "") {
    return String(valor)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function obterIdDoLink(link) {
    if (!link) return null;

    try {
      const url = new URL(link.href, window.location.href);
      const id = Number(url.searchParams.get("id"));
      return Number.isInteger(id) && id > 0 ? id : null;
    } catch {
      return null;
    }
  }

  function extrairItem(container) {
    const link = container.querySelector('a[href*="produto.html?id="]');
    const id = obterIdDoLink(link);
    if (!id) return null;

    const nomeEl =
      container.querySelector(".catalog-card-title") ||
      container.querySelector(".product-detail-title") ||
      container.querySelector(".digital-catalog-card-content h3") ||
      container.querySelector("h3") ||
      container.querySelector("h1");

    const nome = nomeEl?.textContent?.trim();
    if (!nome) return null;

    return { id, nome };
  }

  function criarBotaoInline(container) {
    if (container.querySelector(".interest-inline-button")) return;

    const item = extrairItem(container);
    if (!item) return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "interest-inline-button";
    botao.dataset.interestId = String(item.id);
    botao.dataset.interestName = item.nome;

    botao.addEventListener("click", () => {
      adicionarItem(item);
    });

    const actions =
      container.querySelector(".product-detail-actions") ||
      container.querySelector(".catalog-card-content") ||
      container.querySelector(".digital-catalog-card-content") ||
      container;

    actions.appendChild(botao);
  }

  function adicionarBotoesInline() {
    document
      .querySelectorAll(".catalog-card, .product-detail-info, .digital-catalog-card")
      .forEach(criarBotaoInline);

    atualizarBotoesInline();
  }

  function atualizarBotoesInline() {
    const ids = new Set(lerLista().map((item) => Number(item.id)));

    document.querySelectorAll(".interest-inline-button").forEach((botao) => {
      const id = Number(botao.dataset.interestId);
      const adicionado = ids.has(id);

      botao.disabled = adicionado;
      botao.textContent = adicionado ? "Na lista ✓" : "Adicionar à lista de interesse";
      botao.setAttribute("aria-pressed", String(adicionado));
    });
  }

  function criarWidget() {
    if (document.querySelector(".interest-widget")) return;

    const widget = document.createElement("div");
    widget.className = "interest-widget";
    widget.innerHTML = `
      <button
        type="button"
        class="interest-toggle"
        id="interestToggle"
        aria-expanded="false"
        aria-controls="interestDrawer"
      >
        Lista de interesse
        <span class="interest-count" id="interestCount" aria-live="polite">0</span>
      </button>

      <p class="interest-feedback" id="interestFeedback" role="status" aria-live="polite" hidden></p>

      <section
        class="interest-drawer"
        id="interestDrawer"
        aria-label="Lista de interesse para orçamento"
        hidden
      >
        <div class="interest-drawer-head">
          <h2>Lista de interesse</h2>
          <button type="button" class="interest-close" id="interestClose" aria-label="Fechar lista">×</button>
        </div>

        <div class="interest-items" id="interestItems"></div>

        <div class="interest-drawer-actions">
          <a href="contato.html?lista=1" class="btn btn-gold" id="interestRequest">
            Solicitar orçamento da lista
          </a>
          <a href="#" class="btn btn-outline" id="interestWhatsApp" hidden>
            Enviar lista pelo WhatsApp
          </a>
          <button type="button" class="interest-clear" id="interestClear">Limpar lista</button>
        </div>
      </section>
    `;

    document.body.appendChild(widget);

    const toggle = document.getElementById("interestToggle");
    const drawer = document.getElementById("interestDrawer");
    const close = document.getElementById("interestClose");
    const clear = document.getElementById("interestClear");

    toggle?.addEventListener("click", () => alternarDrawer());
    close?.addEventListener("click", () => fecharDrawer());
    clear?.addEventListener("click", limparLista);

    drawer?.addEventListener("click", (event) => {
      const remover = event.target.closest("[data-interest-remove]");
      if (!remover) return;
      removerItem(Number(remover.dataset.interestRemove));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") fecharDrawer();
    });

    renderizarWidget();
  }

  function alternarDrawer() {
    const drawer = document.getElementById("interestDrawer");
    const toggle = document.getElementById("interestToggle");
    if (!drawer || !toggle) return;

    const abrir = drawer.hidden;
    drawer.hidden = !abrir;
    toggle.setAttribute("aria-expanded", String(abrir));

    if (abrir) {
      document.getElementById("interestClose")?.focus();
    }
  }

  function fecharDrawer() {
    const drawer = document.getElementById("interestDrawer");
    const toggle = document.getElementById("interestToggle");
    if (!drawer || !toggle || drawer.hidden) return;

    drawer.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  function criarMensagemLista(lista) {
    const linhas = lista.map((item) => `- ${item.nome}`);
    return [
      "Olá! Gostaria de solicitar orçamento para os seguintes equipamentos:",
      "",
      ...linhas,
      "",
      "Podem me passar disponibilidade e informações comerciais?"
    ].join("\n");
  }

  function configurarWhatsApp(lista) {
    const link = document.getElementById("interestWhatsApp");
    if (!link) return;

    const numero = window.LIGHT_CONTACT?.whatsapp;
    if (!numero || lista.length === 0) {
      link.hidden = true;
      return;
    }

    const somenteDigitos = String(numero).replace(/\D/g, "");
    if (!somenteDigitos) {
      link.hidden = true;
      return;
    }

    link.href = `https://wa.me/${somenteDigitos}?text=${encodeURIComponent(criarMensagemLista(lista))}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
  }

  function renderizarWidget() {
    const lista = lerLista();
    const count = document.getElementById("interestCount");
    const items = document.getElementById("interestItems");
    const request = document.getElementById("interestRequest");
    const clear = document.getElementById("interestClear");

    if (count) count.textContent = String(lista.length);

    if (items) {
      items.innerHTML = lista.length
        ? lista
            .map(
              (item) => `
                <article class="interest-item">
                  <div>
                    <strong>${escaparHtml(item.nome)}</strong>
                    <a href="produto.html?id=${item.id}">Ver equipamento</a>
                  </div>
                  <button
                    type="button"
                    class="interest-remove"
                    data-interest-remove="${item.id}"
                    aria-label="Remover ${escaparHtml(item.nome)} da lista"
                  >
                    Remover
                  </button>
                </article>
              `
            )
            .join("")
        : `
            <p class="interest-empty">
              Sua lista está vazia. Adicione equipamentos do catálogo para solicitar vários modelos de uma vez.
            </p>
          `;
    }

    if (request) {
      request.setAttribute("aria-disabled", String(lista.length === 0));
      request.style.pointerEvents = lista.length === 0 ? "none" : "";
      request.style.opacity = lista.length === 0 ? "0.5" : "";
    }

    if (clear) clear.disabled = lista.length === 0;

    configurarWhatsApp(lista);
  }

  function mostrarFeedback(texto) {
    const feedback = document.getElementById("interestFeedback");
    if (!feedback) return;

    feedback.textContent = texto;
    feedback.hidden = false;

    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedback.hidden = true;
    }, 2500);
  }

  function preencherContatoDaLista() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("lista") !== "1") return;

    const lista = lerLista();
    if (lista.length === 0) return;

    const assunto = document.getElementById("assunto");
    const mensagem = document.getElementById("mensagem");

    if (assunto && !assunto.value.trim()) {
      assunto.value = "Orçamento - lista de interesse";
    }

    if (mensagem && !mensagem.value.trim()) {
      mensagem.value = criarMensagemLista(lista);
    }
  }

  function observarConteudoDinamico() {
    const observer = new MutationObserver(() => {
      adicionarBotoesInline();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  criarWidget();
  adicionarBotoesInline();
  preencherContatoDaLista();
  observarConteudoDinamico();
})();
