(() => {
  const CONFIG_URL = "./data/contato.json";

  function somenteDigitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function urlWhatsApp(numero, mensagem = "Olá! Gostaria de solicitar um orçamento.") {
    const digitos = somenteDigitos(numero);
    return digitos
      ? `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`
      : null;
  }

  function urlInstagram(valor) {
    if (!valor) return null;
    const limpo = String(valor).trim();
    if (/^https?:\/\//i.test(limpo)) return limpo;
    const usuario = limpo.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
    return usuario ? `https://www.instagram.com/${usuario}/` : null;
  }

  function textoInstagram(valor) {
    if (!valor) return null;
    const match = String(valor).match(/instagram\.com\/([^/?#]+)/i);
    const usuario = match?.[1] || String(valor).replace(/^@/, "").replace(/^\/+|\/+$/g, "");
    return usuario ? `@${usuario}` : null;
  }

  function definirTexto(seletor, valor) {
    document.querySelectorAll(seletor).forEach((elemento) => {
      if (valor) {
        elemento.textContent = valor;
        elemento.hidden = false;
      } else {
        elemento.hidden = true;
      }
    });
  }

  function definirVisibilidade(seletor, visivel) {
    document.querySelectorAll(seletor).forEach((elemento) => {
      elemento.hidden = !visivel;
    });
  }

  function configurarLinks(seletor, href, rotulo) {
    document.querySelectorAll(seletor).forEach((link) => {
      if (!href) {
        link.hidden = true;
        link.removeAttribute("href");
        return;
      }

      link.href = href;
      link.hidden = false;
      if (rotulo) link.textContent = rotulo;

      if (/^https?:\/\//i.test(href)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  }

  function escaparHtml(valor = "") {
    return String(valor)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderizarVendedores(vendedores) {
    const container = document.querySelector("[data-contact-sellers]");
    if (!container) return false;

    const validos = Array.isArray(vendedores)
      ? vendedores.filter((vendedor) => vendedor?.nome && vendedor?.whatsapp)
      : [];

    if (validos.length === 0) {
      container.hidden = true;
      container.innerHTML = "";
      return false;
    }

    container.hidden = false;
    container.innerHTML = validos
      .map((vendedor) => {
        const link = urlWhatsApp(
          vendedor.whatsapp,
          `Olá, ${vendedor.nome}! Gostaria de solicitar um orçamento da Light Metalúrgica.`
        );

        return `
          <article class="contact-card contact-seller-card">
            <small>Atendimento comercial</small>
            <strong>${escaparHtml(vendedor.nome)}</strong>
            <a href="${link}" target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp
            </a>
          </article>
        `;
      })
      .join("");

    return true;
  }

  function aplicar(config) {
    const whatsapp = config.whatsappPrincipal || config.vendedores?.[0]?.whatsapp || null;
    const telefoneOuWhatsapp = config.telefone || whatsapp;
    const whatsappUrl = urlWhatsApp(whatsapp);
    const instagramUrl = urlInstagram(config.instagram);
    const instagramTexto = textoInstagram(config.instagram);

    window.LIGHT_CONTACT = {
      whatsapp,
      instagram: config.instagram || null,
      email: config.email || null,
      telefone: config.telefone || null,
      localidade: config.localidadePublica || null,
      endereco: config.enderecoPublico || null,
      vendedores: Array.isArray(config.vendedores) ? config.vendedores : []
    };

    definirTexto("[data-contact-whatsapp-text]", telefoneOuWhatsapp);
    definirTexto("[data-contact-instagram-text]", instagramTexto);
    definirTexto("[data-contact-email-text]", config.email);
    definirTexto("[data-contact-location-text]", config.localidadePublica);
    definirTexto("[data-contact-address-text]", config.enderecoPublico);

    definirVisibilidade("[data-contact-whatsapp-card]", Boolean(telefoneOuWhatsapp));
    definirVisibilidade("[data-contact-instagram-card]", Boolean(instagramTexto));
    definirVisibilidade("[data-contact-email-card]", Boolean(config.email));
    definirVisibilidade("[data-contact-location-card]", Boolean(config.localidadePublica));
    definirVisibilidade("[data-contact-address-card]", Boolean(config.enderecoPublico));

    configurarLinks("[data-contact-whatsapp-link]", whatsappUrl);
    configurarLinks("[data-contact-instagram-link]", instagramUrl);
    configurarLinks(
      "[data-contact-email-link]",
      config.email ? `mailto:${config.email}` : null
    );

    const temVendedores = renderizarVendedores(config.vendedores);
    const temCanalDireto = Boolean(
      whatsappUrl || instagramUrl || config.email || temVendedores
    );

    const aviso = document.getElementById("contactPendingNotice");
    if (aviso) aviso.hidden = temCanalDireto;

    document.dispatchEvent(
      new CustomEvent("light:contact-ready", { detail: window.LIGHT_CONTACT })
    );
  }

  async function iniciar() {
    try {
      const resposta = await fetch(CONFIG_URL, { cache: "no-store" });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const config = await resposta.json();
      aplicar(config || {});
    } catch (erro) {
      console.warn("Contatos comerciais ainda não configurados.", erro);
      window.LIGHT_CONTACT = {
        whatsapp: null,
        instagram: null,
        email: null,
        telefone: null,
        localidade: null,
        endereco: null,
        vendedores: []
      };
    }
  }

  iniciar();
})();
