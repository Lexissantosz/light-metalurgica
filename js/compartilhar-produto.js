(() => {
  let feedbackTimer = null;

  function obterDadosProduto() {
    const titulo = document.querySelector(".product-detail-title");
    if (!titulo) return null;

    const nome = titulo.textContent.trim();
    if (!nome) return null;

    const url = new URL(window.location.href);
    url.hash = "";

    return {
      title: `${nome} | Light Metalúrgica`,
      text: `Confira o equipamento ${nome} da Light Metalúrgica.`,
      url: url.href,
      nome
    };
  }

  async function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return;
    }

    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    campo.style.pointerEvents = "none";

    document.body.appendChild(campo);
    campo.select();

    const copiado = document.execCommand("copy");
    campo.remove();

    if (!copiado) {
      throw new Error("Não foi possível copiar o link automaticamente.");
    }
  }

  function mostrarFeedback(texto, sucesso = true) {
    const feedback = document.querySelector(".product-share-feedback");
    const botao = document.querySelector(".product-share-button");
    if (!feedback) return;

    feedback.textContent = texto;
    feedback.hidden = false;

    if (botao) {
      botao.dataset.state = sucesso ? "success" : "error";
    }

    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedback.hidden = true;
      if (botao) delete botao.dataset.state;
    }, 3000);
  }

  async function compartilharProduto() {
    const dados = obterDadosProduto();
    if (!dados) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: dados.title,
          text: dados.text,
          url: dados.url
        });
        return;
      } catch (erro) {
        if (erro?.name === "AbortError") return;
      }
    }

    try {
      await copiarTexto(dados.url);
      mostrarFeedback("Link do equipamento copiado.");
    } catch (erro) {
      console.error("Erro ao compartilhar produto:", erro);
      mostrarFeedback("Não foi possível copiar o link automaticamente.", false);
    }
  }

  function inserirAcao() {
    const actions = document.querySelector(".product-detail-actions");
    if (!actions || actions.querySelector(".product-share-button")) return false;

    const dados = obterDadosProduto();
    if (!dados) return false;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "product-share-button";
    botao.setAttribute("aria-label", `Compartilhar ${dados.nome}`);
    botao.innerHTML = `<span aria-hidden="true">↗</span> Compartilhar equipamento`;
    botao.addEventListener("click", compartilharProduto);

    const feedback = document.createElement("p");
    feedback.className = "product-share-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;

    actions.appendChild(botao);
    actions.insertAdjacentElement("afterend", feedback);
    return true;
  }

  if (!inserirAcao()) {
    const alvo = document.getElementById("productDetailContainer") || document.body;
    const observer = new MutationObserver(() => {
      if (inserirAcao()) observer.disconnect();
    });

    observer.observe(alvo, {
      childList: true,
      subtree: true
    });
  }
})();
