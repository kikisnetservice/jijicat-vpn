(() => {
  "use strict";

  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  const desktopMenu = window.matchMedia("(min-width: 901px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector("[data-theme-color]");
  const themeToggles = [...document.querySelectorAll("[data-theme-toggle]")];

  const readSavedTheme = () => {
    try {
      const value = localStorage.getItem("jijicat-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  };

  const applyTheme = (theme, persist = false) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    themeColor?.setAttribute("content", nextTheme === "dark" ? "#171519" : "#F4ECE3");

    themeToggles.forEach((toggle) => {
      const dark = nextTheme === "dark";
      const label = dark ? "Включить светлую тему" : "Включить тёмную тему";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    });

    if (persist) {
      try { localStorage.setItem("jijicat-theme", nextTheme); } catch (error) { /* Storage may be unavailable. */ }
    }
  };

  applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? "dark" : "light"));

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
    });
  });

  systemTheme.addEventListener("change", (event) => {
    if (!readSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const setMenu = (open, returnFocus = false) => {
    if (!navToggle || !navigation || !header) return;

    navigation.classList.toggle("is-open", open);
    header.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("nav-open", open && !desktopMenu.matches);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");

    if (returnFocus) navToggle.focus();
  };

  navToggle?.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (!header || header.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false, true);
    }
  });

  desktopMenu.addEventListener("change", () => setMenu(false));

  const getHeaderHeight = () => header?.offsetHeight || parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;

  const getDocumentTop = (element) => {
    let top = 0;
    let node = element;

    while (node) {
      top += node.offsetTop;
      node = node.offsetParent;
    }

    return top;
  };

  const scrollToElement = (target, historyMode = "none") => {
    if (!target) return;

    const scrollMargin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = Math.max(0, getDocumentTop(target) - getHeaderHeight() - scrollMargin);
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });

    if (target.id && historyMode !== "none") {
      const url = `${window.location.pathname}${window.location.search}#${target.id}`;
      if (historyMode === "push") history.pushState(null, "", url);
      if (historyMode === "replace") history.replaceState(null, "", url);
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]:not(.skip-link)');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : document.documentElement;
    if (!target) return;

    event.preventDefault();
    setMenu(false);
    requestAnimationFrame(() => scrollToElement(target, "push"));
  });

  window.addEventListener("load", () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) scrollToElement(document.getElementById(id));
  }, { once: true });

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!reducedMotion && "IntersectionObserver" in window) {
    revealItems.forEach((item) => item.classList.add("will-reveal"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    requestAnimationFrame(() => revealItems.forEach((item) => revealObserver.observe(item)));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const mainNavLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const observedSections = mainNavLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (observedSections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      mainNavLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: "-25% 0px -60%", threshold: [0.02, 0.2, 0.5] });

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const sectionNavigation = document.querySelector("[data-section-nav]");
  const previousSectionButton = sectionNavigation?.querySelector("[data-section-prev]");
  const nextSectionButton = sectionNavigation?.querySelector("[data-section-next]");
  const pageSections = [...document.querySelectorAll("main > section[id], footer.site-footer[id]")];

  if (sectionNavigation && previousSectionButton && nextSectionButton && pageSections.length) {
    let currentSectionIndex = 0;
    let sectionTicking = false;

    const updateSectionNavigation = () => {
      const marker = window.scrollY + getHeaderHeight() + 12;
      let nextIndex = 0;

      pageSections.forEach((section, index) => {
        const sectionTop = getDocumentTop(section);
        if (sectionTop <= marker) nextIndex = index;
      });

      const pageBottom = document.documentElement.scrollHeight - 2;
      if (window.scrollY + window.innerHeight >= pageBottom) nextIndex = pageSections.length - 1;

      currentSectionIndex = nextIndex;
      previousSectionButton.disabled = currentSectionIndex === 0;
      nextSectionButton.disabled = currentSectionIndex === pageSections.length - 1;
      sectionNavigation.dataset.section = `${currentSectionIndex + 1}/${pageSections.length}`;
      sectionTicking = false;
    };

    const requestSectionUpdate = () => {
      if (sectionTicking) return;
      sectionTicking = true;
      requestAnimationFrame(updateSectionNavigation);
    };

    previousSectionButton.addEventListener("click", () => {
      updateSectionNavigation();
      scrollToElement(pageSections[Math.max(0, currentSectionIndex - 1)], "replace");
    });

    nextSectionButton.addEventListener("click", () => {
      updateSectionNavigation();
      scrollToElement(pageSections[Math.min(pageSections.length - 1, currentSectionIndex + 1)], "replace");
    });

    updateSectionNavigation();
    window.addEventListener("scroll", requestSectionUpdate, { passive: true });
    window.addEventListener("resize", requestSectionUpdate);
  }

  const legalHeadings = [...document.querySelectorAll(".legal-document h2[id]")];
  const tocLinks = [...document.querySelectorAll('.legal-toc a[href^="#"]')];

  if (legalHeadings.length && tocLinks.length && "IntersectionObserver" in window) {
    const tocObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) return;
      tocLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height"), 10) + 30}px 0px -70%`, threshold: 0 });

    legalHeadings.forEach((heading) => tocObserver.observe(heading));
  }
})();
