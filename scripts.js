document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const ctaButton = document.querySelector(".cta-button");
  const navbar = document.querySelector(".navbar");
  const footer = document.querySelector("footer");
  const flipCat = document.querySelector(".flip-cat");

  // Функция применения темы
  function applyTheme(theme) {
    if (theme === "dark") {
      navbar.classList.add("dark-mode");
      footer.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      navbar.classList.remove("dark-mode");
      footer.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }

  // Проверка начальной темы
  const userPreference = localStorage.getItem("theme");
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  // Устанавливаем тему
  applyTheme(userPreference || systemPreference);

  // Событие клика на кота
  flipCat.addEventListener("click", function () {
    // Анимация переворота кота
    flipCat.style.transition = "none";
    flipCat.style.transform = "rotate(0deg)";

    setTimeout(function () {
      flipCat.style.transition = "transform 0.5s ease-in-out";
      flipCat.style.transform = "rotate(360deg)";
    }, 10);

    // Переключение темы
    const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);

    // Сохраняем предпочтение пользователя
    localStorage.setItem("theme", newTheme);
  });

  // Плавный скролл
  navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = event.currentTarget.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 40,
          behavior: "smooth"
        });
      }
    });
  });

  // Фиксация navbar при скролле
  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      navbar.classList.add("navbar-fixed");
    } else {
      navbar.classList.remove("navbar-fixed");
    }

    // Обновление активной ссылки
    let currentSection = "";
    document.querySelectorAll(".section").forEach(section => {
      const sectionTop = section.offsetTop - 50;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active");
      }
    });
  });
});
