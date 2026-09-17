(() => {
  const DEFAULTS = {
    title: "Light Metalúrgica | Equipamentos para academias",
    description:
      "Conheça o catálogo da Light Metalúrgica e consulte equipamentos para academias, estúdios e espaços de treinamento.",
    type: "website"
  };

  const PAGE_META = {
    "/": DEFAULTS,
    "/index.html": DEFAULTS,
    "/produtos.html": {
      title: "Catálogo de equipamentos | Light Metalúrgica",
      description:
        "Explore os equipamentos disponíveis no catálogo da Light Metalúrgica e solicite informações comerciais.",
      type: "website"
    },
    "/catalogo.html": {
      title: "Catálogo digital | Light Metalúrgica",
      description:
        "Consulte o catálogo digital da Light Metalúrgica e acesse os equipamentos disponíveis para orçamento.",
      type: "website"
    },
    "/sobre.html": {
      title: "Sobre | Light Metalúrgica",
      description:
        "Conheça a apresentação institucional da Light Metalúrgica e sua linha de equipamentos para espaços de treinamento.",
      type: "website"
    },
    "/contato.html": {
      title: "Contato e orçamento | Light Metalúrgica",
      description:
        "Entre em contato com a Light Metalúrgica para consultar equipamentos, disponibilidade e solicitar orçamento.",
      type: "website"
    }
  };

  function selecionarMeta(name, property) {
    const seletor = property
      ? `meta[property="${property}"]`
      : `meta[name="${name}"]`;
    return document.head.querySelector(seletor);
  }

  function definirMeta({ name, property, content }) {
    if (!content) return;

    let meta = selecionarMeta(name, property);
    if (!meta) {
      meta = document.createElement("meta");
      if (property) meta.setAttribute("property", property);
      else meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", content);
  }

  function definirLink(rel, href) {
    if (!href) return;
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function urlCanonica() {
    const url = new URL(window.location.href);
    url.hash = "";

    if (!url.pathname.endsWith("produto.html")) {
      url.search = "";
    } else {
      const id = url.searchParams.get("id");
      url.search = id ? `?id=${encodeURIComponent(id)}` : "";
    }

    return url.toString();
  }

  function caminhoNormalizado() {
    const pathname = window.location.pathname || "/";
    const nome = pathname.split("/").pop();
    return nome ? `/${nome}` : "/";
  }

  function urlAbsoluta(caminho) {
    if (!caminho) return null;
    try {
      return new URL(caminho, window.location.href).toString();
    } catch {
      return null;
    }
  }

  function aplicarMetaBasica(meta) {
    const canonical = urlCanonica();
    document.title = meta.title || DEFAULTS.title;

    definirMeta({ name: "description", content: meta.description || DEFAULTS.description });
    definirMeta({ property: "og:title", content: document.title });
    definirMeta({ property: "og:description", content: meta.description || DEFAULTS.description });
    definirMeta({ property: "og:type", content: meta.type || "website" });
    definirMeta({ property: "og:locale", content: "pt_BR" });
    definirMeta({ property: "og:site_name", content: "Light Metalúrgica" });
    definirMeta({ property: "og:url", content: canonical });
    definirMeta({ name: "twitter:card", content: meta.image ? "summary_large_image" : "summary" });
    definirMeta({ name: "twitter:title", content: document.title });
    definirMeta({ name: "twitter:description", content: meta.description || DEFAULTS.description });

    if (meta.image) {
      const image = urlAbsoluta(meta.image);
      definirMeta({ property: "og:image", content: image });
      definirMeta({ name: "twitter:image", content: image });
    }

    definirLink("canonical", canonical);
    definirLink("icon", urlAbsoluta("./arquivos/favicon.svg"));
  }

  function adicionarJsonLd(id, dados) {
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(dados);
  }

  function aplicarSchemaBase() {
    const siteUrl = new URL("./", window.location.href).toString();

    adicionarJsonLd("seo-organization-schema", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Light Metalúrgica",
      url: siteUrl
    });

    adicionarJsonLd("seo-website-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Light Metalúrgica",
      url: siteUrl,
      inLanguage: "pt-BR"
    });
  }

  async function aplicarMetaProduto() {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!Number.isInteger(id) || id <= 0 || !window.catalogoData) return false;

    try {
      const produtos = await window.catalogoData.carregarProdutosPublicos();
      const produto = produtos.find((item) => item.id === id);
      if (!produto) return false;

      const meta = {
        title: `${produto.nome} | Light Metalúrgica`,
        description:
          produto.descricaoCurta ||
          `Consulte informações e orçamento do equipamento ${produto.nome}.`,
        type: "product",
        image: produto.imagem || null
      };

      aplicarMetaBasica(meta);

      adicionarJsonLd("seo-product-schema", {
        "@context": "https://schema.org",
        "@type": "Product",
        name: produto.nome,
        description: meta.description,
        image: produto.imagem ? [urlAbsoluta(produto.imagem)] : undefined,
        sku: produto.codigo || String(produto.id),
        category: produto.categoria,
        url: urlCanonica(),
        brand: {
          "@type": "Brand",
          name: "Light Metalúrgica"
        }
      });

      return true;
    } catch (erro) {
      console.warn("SEO: não foi possível carregar os metadados do produto.", erro);
      return false;
    }
  }

  async function iniciarSeo() {
    aplicarSchemaBase();

    const caminho = caminhoNormalizado();
    if (caminho === "/produto.html") {
      const aplicado = await aplicarMetaProduto();
      if (aplicado) return;
    }

    aplicarMetaBasica(PAGE_META[caminho] || DEFAULTS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarSeo, { once: true });
  } else {
    iniciarSeo();
  }
})();
