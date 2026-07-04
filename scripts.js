document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-logo");
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const footer = document.querySelector("footer");
  const flipCat = document.querySelector(".flip-cat");
  const ipDisplayContainer = document.querySelector(".ip-display");
  const ipDisplay = ipDisplayContainer?.querySelector("span");
  const sections = document.querySelectorAll(".section");
  const currentYear = document.querySelector("[data-current-year]");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  function updateNavbarOffset() {
    if (!navbar) return;
    document.documentElement.style.setProperty("--navbar-offset", `${navbar.offsetHeight}px`);
  }

  // Применение темы
  function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    if (navbar) navbar.classList.toggle("dark-mode", theme === "dark");
    if (footer) footer.classList.toggle("dark-mode", theme === "dark");
  }

  // Установка темы
  applyTheme(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  updateNavbarOffset();

  if (navbar && "ResizeObserver" in window) {
    new ResizeObserver(updateNavbarOffset).observe(navbar);
  }

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

  function setMenuOpen(isOpen) {
    if (!navbar || !navToggle) return;

    navbar.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  }

  function setActiveLink(sectionId) {
    document.querySelectorAll(".nav-links a").forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
    });
  }

  function updateActiveSection() {
    if (!sections.length) return;

    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const marker = window.scrollY + navbarHeight + 2;
    let currentSection = sections[0].getAttribute("id");

    sections.forEach(section => {
      if (section.offsetTop <= marker) {
        currentSection = section.getAttribute("id");
      }
    });

    setActiveLink(currentSection);
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  document.addEventListener("click", function (event) {
    if (navbar && !navbar.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", function () {
    updateNavbarOffset();
    if (window.innerWidth > 640) {
      setMenuOpen(false);
    }
    updateActiveSection();
  });

  // Плавный скролл
  if (navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener("click", function (event) {
        const href = this.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        event.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          setMenuOpen(false);
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", href);
        }
      });
    });
  }

  // Фикс navbar при скролле + активная ссылка
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("navbar-fixed", window.scrollY > 0);
      updateActiveSection();
    }, { passive: true });
  }

  updateActiveSection();

  if (ipDisplayContainer && ipDisplay) {
    ipDisplayContainer.style.display = "none";

    fetch("https://checkip.amazonaws.com")
      .then(response => response.text())
      .then(ip => {
        ipDisplay.textContent = ip.trim();
        ipDisplayContainer.style.display = "block";
        setTimeout(() => {
          ipDisplayContainer.style.opacity = "1";
        }, 10);
      })
      .catch(() => {
        ipDisplayContainer.style.display = "none";
      });
  }
});