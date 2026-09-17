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

  window.addEventListener("scroll", atualizarHeader, { passive: true });
  atualizarHeader();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  const navLinks = nav.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
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

carregarCamadaAcessibilidadePerformance();
