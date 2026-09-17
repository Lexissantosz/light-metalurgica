const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

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

function carregarCompartilhamentoProduto() {
  if (!document.getElementById("productDetailContainer")) return;

  if (!document.querySelector('link[data-light-share="true"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./css/compartilhar-produto.css";
    link.dataset.lightShare = "true";
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[data-light-share="true"]')) {
    const script = document.createElement("script");
    script.src = "./js/compartilhar-produto.js";
    script.dataset.lightShare = "true";
    document.body.appendChild(script);
  }
}

carregarCompartilhamentoProduto();
