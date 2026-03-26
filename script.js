const body = document.body;
const currentPage = body.dataset.page;
const root = document.documentElement;

const storedTheme = localStorage.getItem("mb-theme");
if (storedTheme === "dark" || storedTheme === "light") {
  root.dataset.theme = storedTheme;
} else {
  root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.querySelectorAll(".site-nav a[data-link]").forEach((link) => {
  if (link.dataset.link === currentPage) {
    link.classList.add("is-active");
  }
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const themeToggle = document.querySelector(".theme-toggle");
const updateThemeControl = () => {
  if (!themeToggle) return;
  const isDark = root.dataset.theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  const label = themeToggle.querySelector(".theme-toggle-label");
  if (label) {
    label.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }
};

if (themeToggle) {
  updateThemeControl();
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("mb-theme", nextTheme);
    updateThemeControl();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[data-count]");

if (counters.length > 0) {
  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const quotes = document.querySelectorAll(".quote");
const dots = document.querySelectorAll(".dot");

if (quotes.length > 0 && dots.length === quotes.length) {
  let activeQuote = 0;

  const showQuote = (index) => {
    quotes.forEach((quote, quoteIndex) => {
      quote.classList.toggle("active", quoteIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });

    activeQuote = index;
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showQuote(index));
  });

  setInterval(() => {
    showQuote((activeQuote + 1) % quotes.length);
  }, 4600);
}

const infoFab = document.querySelector(".info-fab");
const infoFabToggle = document.querySelector(".info-fab-toggle");

if (infoFab && infoFabToggle) {
  infoFabToggle.addEventListener("click", () => {
    const isOpen = infoFab.classList.toggle("is-open");
    infoFabToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
