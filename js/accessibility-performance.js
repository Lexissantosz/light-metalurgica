(() => {
  const main = document.querySelector("main");
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");

  function garantirDestinoPrincipal() {
    if (!main) return;

    if (!main.id) {
      main.id = "conteudo-principal";
    }

    if (!main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
    }
  }

  function criarSkipLink() {
    if (!main || document.querySelector(".skip-link")) return;

    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = `#${main.id}`;
    link.textContent = "Pular para o conteúdo";

    document.body.prepend(link);
  }

  function prepararNavegacao() {
    if (nav && !nav.hasAttribute("aria-label")) {
      nav.setAttribute("aria-label", "Navegação principal");
    }

    const linkAtivo = document.querySelector(".nav-link.active");
    if (linkAtivo) {
      linkAtivo.setAttribute("aria-current", "page");
    }

    if (!menuToggle || !nav) return;

    menuToggle.setAttribute("type", "button");

    const sincronizarMenu = () => {
      const aberto = nav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", String(aberto));
      menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
      );
    };

    sincronizarMenu();

    menuToggle.addEventListener("click", () => {
      requestAnimationFrame(sincronizarMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !nav.classList.contains("open")) return;

      nav.classList.remove("open");
      sincronizarMenu();
      menuToggle.focus();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        sincronizarMenu();
      }
    });
  }

  function prepararImagem(img) {
    if (!(img instanceof HTMLImageElement)) return;

    img.decoding = "async";

    const imagemPrioritaria =
      img.getAttribute("fetchpriority") === "high" ||
      Boolean(img.closest(".hero-pro"));

    if (imagemPrioritaria) {
      img.loading = "eager";
      return;
    }

    if (!img.hasAttribute("loading")) {
      img.loading = "lazy";
    }
  }

  function prepararImagensExistentes() {
    document.querySelectorAll("img").forEach(prepararImagem);
  }

  function observarImagensDinamicas() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          if (node.matches("img")) {
            prepararImagem(node);
          }

          node.querySelectorAll?.("img").forEach(prepararImagem);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function reforcarLinksExternos() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const relAtual = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      relAtual.add("noopener");
      relAtual.add("noreferrer");

      link.setAttribute("rel", [...relAtual].join(" "));
    });
  }

  garantirDestinoPrincipal();
  criarSkipLink();
  prepararNavegacao();
  prepararImagensExistentes();
  observarImagensDinamicas();
  reforcarLinksExternos();
})();
