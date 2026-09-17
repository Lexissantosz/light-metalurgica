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

function carregarListaInteresse() {
  if (!document.querySelector('link[data-light-interest="true"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./css/lista-interesse.css";
    link.dataset.lightInterest = "true";
    document.head.appendChild(link);
  }

  if (!document.querySelector('script[data-light-interest="true"]')) {
    const script = document.createElement("script");
    script.src = "./js/lista-interesse.js";
    script.dataset.lightInterest = "true";
    document.body.appendChild(script);
  }
}

carregarListaInteresse();
