const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
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

if (!document.getElementById("light-responsive-css")) {
  const responsiveCss = document.createElement("link");
  responsiveCss.id = "light-responsive-css";
  responsiveCss.rel = "stylesheet";
  responsiveCss.href = "./css/responsive-final.css";
  document.head.appendChild(responsiveCss);
}
