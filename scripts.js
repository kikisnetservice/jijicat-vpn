document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const ctaButton = document.querySelector(".cta-button");
  const navbar = document.querySelector(".navbar");

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
    if (window.scrollY > 0) {
      navbar.classList.add("navbar-fixed");
    } else {
      navbar.classList.remove("navbar-fixed");
    }
  });
  
  // Функция, которая убирает hover-состояние
  function removeHover() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('hover');
    });
  }
  
  // Слушаем событие скролла на документе
  document.addEventListener('scroll', removeHover);

  // Слушаем событие касания (для мобильных устройств)
  document.addEventListener('touchstart', removeHover);
  
  // Также добавляем "hover" при касании ссылки
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('touchstart', function() {
      link.classList.add('hover');
    });
  });
});
