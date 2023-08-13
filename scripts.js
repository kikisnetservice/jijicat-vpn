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
});
