document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const ctaButton = document.querySelector(".cta-button");
  const navbar = document.querySelector(".navbar");
  const footer = document.querySelector("footer");
  const flipCat = document.querySelector(".flip-cat");
  const ipDisplay = document.querySelector(".ip-display span");

  // Применение темы
  function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    if (navbar) navbar.classList.toggle("dark-mode", theme === "dark");
    if (footer) footer.classList.toggle("dark-mode", theme === "dark");
  }

  // Установка темы
  applyTheme(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  // Переключение темы
  if (flipCat) {
    flipCat.addEventListener("click", function () {
      flipCat.style.transition = "none";
      flipCat.style.transform = "rotate(0deg)";
      setTimeout(() => {
        flipCat.style.transition = "transform 0.5s ease-in-out";
        flipCat.style.transform = "rotate(360deg)";
      }, 10);

      const newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // Плавный скролл
  if (navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetSection = document.querySelector(this.getAttribute("href"));
        if (targetSection) {
          window.scrollTo({ top: targetSection.offsetTop - 40, behavior: "smooth" });
        }
      });
    });
  }

  // Фикс navbar при скролле + активная ссылка
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("navbar-fixed", window.scrollY > 0);
      
      let currentSection = "";
      document.querySelectorAll(".section").forEach(section => {
        if (window.scrollY >= section.offsetTop - 50 && window.scrollY < section.offsetTop + section.offsetHeight) {
          currentSection = section.getAttribute("id");
        }
      });

      if (navLinks.length) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href").substring(1) === currentSection);
        });
      }
    });
  }

  // Получение IP-адреса через Cloudflare
  function fetchIP() {
    ipDisplay.textContent = "определяю...";
    fetch("https://1.1.1.1/cdn-cgi/trace")
      .then(response => response.text())
      .then(data => {
        const ipMatch = data.match(/ip=([\d\.]+)/);
        ipDisplay.textContent = ipMatch ? ipMatch[1] : "не удалось определить";
      })
      .catch(() => {
        ipDisplay.textContent = "не удалось определить";
        ipDisplay.classList.add("error");
      });
  }

  if (ipDisplay) fetchIP();
});
