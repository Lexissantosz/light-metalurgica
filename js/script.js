function carregarIdentidadeVisual() {
  if (document.querySelector('link[data-light-brand="true"]')) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/brand.css";
  link.dataset.lightBrand = "true";
  document.head.appendChild(link);
}

function carregarCamadaAcessibilidadePerformance() {
  if (!document.querySelector('link[data-light-a11y="true"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./css/accessibility-performance.css";
    link.dataset.lightA11y = "true";
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[data-light-a11y="true"]')) {
    const script = document.createElement("script");
    script.src = "./js/accessibility-performance.js";
    script.dataset.lightA11y = "true";
    document.body.appendChild(script);
  }
}

carregarIdentidadeVisual();
carregarCamadaAcessibilidadePerformance();

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (header) {
  const atualizarHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  atualizarHeader();
  window.addEventListener("scroll", atualizarHeader, { passive: true });
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const aberto = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  });

  const navLinks = nav.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}
