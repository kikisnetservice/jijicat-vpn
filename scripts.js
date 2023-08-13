document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(link => {
    link.addEventListener("click", smoothScroll);
  });

  function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    
    window.scrollTo({
      top: targetSection.offsetTop - 40,
      behavior: "smooth"
    });
  }
});
