document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const ctaButton = document.querySelector(".cta-button");
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll(".section");
  
  // Функция для переворота кота
  const flipCat = document.querySelector(".flip-cat");

  flipCat.addEventListener("click", function () {
    // Сбрасываем трансформацию перед поворотом, чтобы можно было повторно кликать
    flipCat.style.transition = "none"; // Отключаем плавный переход, чтобы моментально сбросить состояние
    flipCat.style.transform = "rotate(0deg)"; // Сбрасываем поворот в начальное состояние

    // Даем немного времени на сброс (через setTimeout), а затем выполняем переворот
    setTimeout(function () {
      flipCat.style.transition = "transform 0.5s ease-in-out"; // Включаем плавный переход
      flipCat.style.transform = "rotate(360deg)"; // Поворот на 360 градусов
    }, 10); // небольшой таймаут, чтобы сбросить состояние
  });
  
  navLinks.forEach(link => {
    link.addEventListener("click", smoothScroll);
  });
  
  ctaButton.addEventListener("click", smoothScroll);

  function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 40,
        behavior: "smooth"
      });
    }
  }

  window.addEventListener("scroll", function () {
    // Добавление фиксированного navbar при скролле
    if (window.scrollY > 0) {
      navbar.classList.add("navbar-fixed");
    } else {
      navbar.classList.remove("navbar-fixed");
    }

    // Определяем текущую видимую секцию
    let currentSection = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 50;  // Делаем немного больше отступ для фиксированного меню
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.getAttribute("id");
      }
    });

    // Обновление активной ссылки
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active");
      }
    });
  });
});