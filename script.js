const body = document.body;
const currentPage = body.dataset.page;
const root = document.documentElement;

const PRODUCT_STORAGE_KEY = "mb-products-v1";
const ADMIN_PASSWORD_KEY = "mb-admin-password-v1";
const ADMIN_SESSION_KEY = "mb-admin-session-v1";
const DEFAULT_ADMIN_PASSWORD = "MBGlow2026";

const defaultProducts = [
  {
    id: "base-soft-glow",
    name: "Base Soft Glow",
    tag: "Nuevo",
    description: "Cobertura ligera con acabado luminoso para uso diario.",
    price: 39900,
    image: "",
    available: true
  },
  {
    id: "gloss-candy-shine",
    name: "Gloss Candy Shine",
    tag: "Top",
    description: "Brillo espejo con tono suave y efecto jugoso.",
    price: 18900,
    image: "",
    available: true
  },
  {
    id: "serum-rose-repair",
    name: "Serum Rose Repair",
    tag: "Skin",
    description: "Textura ligera para hidratacion y glow inmediato.",
    price: 42900,
    image: "",
    available: true
  },
  {
    id: "rubor-velvet-pink",
    name: "Rubor Velvet Pink",
    tag: "Makeup",
    description: "Color modulable con acabado aterciopelado y femenino.",
    price: 24900,
    image: "",
    available: true
  },
  {
    id: "paleta-sunset-muse",
    name: "Paleta Sunset Muse",
    tag: "Top",
    description: "Tonos neutros y rosados para looks de dia o noche.",
    price: 54900,
    image: "",
    available: false
  },
  {
    id: "hair-mist-blossom",
    name: "Hair Mist Blossom",
    tag: "Hair",
    description: "Brillo delicado con aroma suave para el cabello.",
    price: 29900,
    image: "",
    available: true
  },
  {
    id: "kit-brochas-luxe",
    name: "Kit Brochas Luxe",
    tag: "Kit",
    description: "Set esencial para base, ojos y detalles de precision.",
    price: 47900,
    image: "",
    available: true
  },
  {
    id: "esmalte-diamond-gel",
    name: "Esmalte Diamond Gel",
    tag: "Unas",
    description: "Color intenso con acabado brillante y larga duracion.",
    price: 14900,
    image: "",
    available: true
  },
  {
    id: "mascarilla-glow-mask",
    name: "Mascarilla Glow Mask",
    tag: "Skin",
    description: "Refresca, ilumina y deja la piel con aspecto bonito.",
    price: 22900,
    image: "",
    available: false
  },
  {
    id: "combo-maria-bonita",
    name: "Combo Maria Bonita",
    tag: "Bundle",
    description: "Seleccion de favoritos para regalar o empezar tu rutina.",
    price: 79900,
    image: "",
    available: true
  }
];

const cloneProducts = (products) => products.map((product) => ({ ...product }));

const loadProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!stored) {
      const defaults = cloneProducts(defaultProducts);
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid product store");
    }

    return parsed.map((product, index) => ({
      id: product.id || `product-${index + 1}`,
      name: product.name || "Producto",
      tag: product.tag || "Nuevo",
      description: product.description || "",
      price: Number(product.price) || 0,
      image: product.image || "",
      available: Boolean(product.available)
    }));
  } catch (error) {
    const fallback = cloneProducts(defaultProducts);
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const saveProducts = (products) => {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
};

const ensureAdminPassword = () => {
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!storedPassword) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
    return DEFAULT_ADMIN_PASSWORD;
  }
  return storedPassword;
};

const getAdminPassword = () => ensureAdminPassword();

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(price);

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `product-${Date.now()}`;

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

const themeToggles = document.querySelectorAll(".theme-toggle");
const updateThemeControl = () => {
  const isDark = root.dataset.theme === "dark";
  themeToggles.forEach((themeToggle) => {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    const label = themeToggle.querySelector(".theme-toggle-label");
    if (label) {
      label.textContent = isDark ? "Modo claro" : "Modo oscuro";
    }
  });
};

if (themeToggles.length > 0) {
  updateThemeControl();
  themeToggles.forEach((themeToggle) => {
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;
      localStorage.setItem("mb-theme", nextTheme);
      updateThemeControl();
    });
  });
}

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      )
    : null;

const observeReveals = (elements = document.querySelectorAll(".reveal")) => {
  elements.forEach((element) => {
    if (!revealObserver) {
      element.classList.add("is-visible");
      return;
    }

    if (!element.classList.contains("is-visible")) {
      revealObserver.observe(element);
    }
  });
};

observeReveals();

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

  const counterObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.6 }
        )
      : null;

  counters.forEach((counter) => {
    if (counterObserver) {
      counterObserver.observe(counter);
    } else {
      animateCounter(counter);
    }
  });
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

const buildProductCard = (product) => {
  const article = document.createElement("article");
  article.className = `shop-card reveal${product.available ? "" : " is-unavailable"}`;

  const media = document.createElement("div");
  media.className = "product-media";

  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    media.append(image);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "product-media-placeholder";
    fallback.textContent = product.tag;
    media.append(fallback);
  }

  const labelRow = document.createElement("div");
  labelRow.className = "product-card-top";

  const tag = document.createElement("span");
  tag.className = "card-label";
  tag.textContent = product.tag;

  const status = document.createElement("span");
  status.className = `product-status ${product.available ? "is-available" : "is-unavailable"}`;
  status.textContent = product.available ? "Disponible" : "No disponible";

  labelRow.append(tag, status);

  const title = document.createElement("h3");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const meta = document.createElement("div");
  meta.className = "shop-meta";

  const price = document.createElement("span");
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.className = `button ${product.available ? "button-soft" : "button-outline"}`;
  button.type = "button";
  button.textContent = product.available ? "Agregar al carrito" : "Consultar disponibilidad";
  button.disabled = !product.available;

  meta.append(price, button);
  article.append(media, labelRow, title, description, meta);
  return article;
};

const renderCatalog = () => {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) {
    return;
  }

  const products = loadProducts();
  grid.innerHTML = "";

  const countTarget = document.querySelector("[data-product-count]");
  const availableTarget = document.querySelector("[data-product-available]");
  if (countTarget) {
    countTarget.textContent = String(products.length);
  }
  if (availableTarget) {
    availableTarget.textContent = String(products.filter((product) => product.available).length);
  }

  if (products.length === 0) {
    grid.innerHTML = '<article class="shop-empty-state reveal"><strong>Aun no hay productos cargados.</strong><span>Entra al panel interno para agregar la primera referencia de la tienda.</span></article>';
    observeReveals(grid.querySelectorAll(".reveal"));
    return;
  }

  products.forEach((product) => {
    grid.append(buildProductCard(product));
  });

  observeReveals(grid.querySelectorAll(".reveal"));
};

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No fue posible leer la imagen"));
    reader.readAsDataURL(file);
  });

const initAdminPage = () => {
  if (currentPage !== "admin") {
    return;
  }

  ensureAdminPassword();

  const loginSection = document.querySelector("[data-admin-login]");
  const dashboardSection = document.querySelector("[data-admin-dashboard]");
  const loginForm = document.querySelector("[data-admin-login-form]");
  const loginFeedback = document.querySelector("[data-admin-login-feedback]");
  const productForm = document.querySelector("[data-admin-product-form]");
  const passwordForm = document.querySelector("[data-admin-password-form]");
  const productFeedback = document.querySelector("[data-admin-product-feedback]");
  const passwordFeedback = document.querySelector("[data-admin-password-feedback]");
  const productList = document.querySelector("[data-admin-product-list]");
  const totalTarget = document.querySelector("[data-admin-total]");
  const availableTarget = document.querySelector("[data-admin-available]");
  const unavailableTarget = document.querySelector("[data-admin-unavailable]");
  const resetButton = document.querySelector("[data-admin-reset]");
  const clearImageButton = document.querySelector("[data-admin-clear-image]");
  const previewWrap = document.querySelector("[data-admin-image-preview]");
  const previewTag = document.querySelector("[data-admin-image-tag]");
  const previewPlaceholder = document.querySelector("[data-admin-image-placeholder]");
  const logoutButton = document.querySelector("[data-admin-logout]");
  const imageInput = productForm?.elements.namedItem("image");

  let currentImage = "";

  const isAuthenticated = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "active";

  const setFeedback = (element, message, isError = false) => {
    if (!element) {
      return;
    }
    element.textContent = message;
    element.classList.toggle("is-error", isError);
    element.classList.toggle("is-success", Boolean(message) && !isError);
  };

  const updatePreview = (image) => {
    currentImage = image || "";
    if (!previewWrap || !previewTag || !previewPlaceholder) {
      return;
    }

    previewWrap.classList.toggle("has-image", Boolean(currentImage));
    previewTag.hidden = !currentImage;
    previewPlaceholder.hidden = Boolean(currentImage);
    previewTag.src = currentImage || "";
  };

  const resetProductForm = () => {
    if (!productForm) {
      return;
    }

    productForm.reset();
    productForm.elements.namedItem("id").value = "";
    productForm.elements.namedItem("availability").value = "available";
    if (imageInput) {
      imageInput.value = "";
    }
    updatePreview("");
    setFeedback(productFeedback, "");
  };

  const fillProductForm = (product) => {
    if (!productForm) {
      return;
    }

    productForm.elements.namedItem("id").value = product.id;
    productForm.elements.namedItem("name").value = product.name;
    productForm.elements.namedItem("tag").value = product.tag;
    productForm.elements.namedItem("description").value = product.description;
    productForm.elements.namedItem("price").value = String(product.price);
    productForm.elements.namedItem("availability").value = product.available ? "available" : "unavailable";
    if (imageInput) {
      imageInput.value = "";
    }
    updatePreview(product.image);
    setFeedback(productFeedback, `Editando "${product.name}"`);
    productForm.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderAdminProducts = () => {
    if (!productList) {
      return;
    }

    const products = loadProducts();
    productList.innerHTML = "";

    if (totalTarget) {
      totalTarget.textContent = String(products.length);
    }
    if (availableTarget) {
      availableTarget.textContent = String(products.filter((product) => product.available).length);
    }
    if (unavailableTarget) {
      unavailableTarget.textContent = String(products.filter((product) => !product.available).length);
    }

    if (products.length === 0) {
      productList.innerHTML =
        '<article class="admin-empty-state"><strong>No hay productos cargados.</strong><span>Crea el primero desde el editor y aparecera aqui automaticamente.</span></article>';
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("article");
      card.className = `admin-product-card${product.available ? "" : " is-unavailable"}`;

      const media = document.createElement("div");
      media.className = "admin-product-media";
      if (product.image) {
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        media.append(image);
      } else {
        const fallback = document.createElement("div");
        fallback.className = "admin-product-fallback";
        fallback.textContent = product.tag;
        media.append(fallback);
      }

      const info = document.createElement("div");
      info.className = "admin-product-info";

      const top = document.createElement("div");
      top.className = "admin-product-top";

      const badge = document.createElement("span");
      badge.className = "card-label";
      badge.textContent = product.tag;

      const status = document.createElement("span");
      status.className = `product-status ${product.available ? "is-available" : "is-unavailable"}`;
      status.textContent = product.available ? "Disponible" : "No disponible";

      top.append(badge, status);

      const title = document.createElement("h3");
      title.textContent = product.name;

      const description = document.createElement("p");
      description.textContent = product.description;

      const meta = document.createElement("div");
      meta.className = "admin-product-meta";
      meta.innerHTML = `<strong>${formatPrice(product.price)}</strong>`;

      const actions = document.createElement("div");
      actions.className = "admin-product-actions";

      const editButton = document.createElement("button");
      editButton.className = "button button-soft";
      editButton.type = "button";
      editButton.textContent = "Editar";
      editButton.addEventListener("click", () => fillProductForm(product));

      const toggleButton = document.createElement("button");
      toggleButton.className = "button button-outline";
      toggleButton.type = "button";
      toggleButton.textContent = product.available ? "Marcar no disponible" : "Marcar disponible";
      toggleButton.addEventListener("click", () => {
        const nextProducts = loadProducts().map((item) =>
          item.id === product.id ? { ...item, available: !item.available } : item
        );
        saveProducts(nextProducts);
        renderAdminProducts();
        renderCatalog();
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "button button-outline";
      deleteButton.type = "button";
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", () => {
        const confirmed = window.confirm(`Eliminar "${product.name}" del catalogo?`);
        if (!confirmed) {
          return;
        }

        const nextProducts = loadProducts().filter((item) => item.id !== product.id);
        saveProducts(nextProducts);
        if (productForm?.elements.namedItem("id").value === product.id) {
          resetProductForm();
        }
        renderAdminProducts();
        renderCatalog();
      });

      actions.append(editButton, toggleButton, deleteButton);
      info.append(top, title, description, meta, actions);
      card.append(media, info);
      productList.append(card);
    });
  };

  const syncView = () => {
    const authenticated = isAuthenticated();
    if (loginSection) {
      loginSection.hidden = authenticated;
    }
    if (dashboardSection) {
      dashboardSection.hidden = !authenticated;
    }
    if (logoutButton) {
      logoutButton.hidden = !authenticated;
    }
    if (authenticated) {
      renderAdminProducts();
      resetProductForm();
      observeReveals(dashboardSection?.querySelectorAll(".reveal") || []);
    }
  };

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = loginForm.elements.namedItem("password").value;
    if (password !== getAdminPassword()) {
      setFeedback(loginFeedback, "Clave incorrecta. Intenta de nuevo.", true);
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "active");
    loginForm.reset();
    setFeedback(loginFeedback, "");
    syncView();
  });

  imageInput?.addEventListener("change", async () => {
    const file = imageInput.files?.[0];
    if (!file) {
      return;
    }

    try {
      const result = await readImageAsDataUrl(file);
      updatePreview(result);
      setFeedback(productFeedback, "Imagen cargada correctamente.");
    } catch (error) {
      setFeedback(productFeedback, "No se pudo cargar la imagen.", true);
    }
  });

  clearImageButton?.addEventListener("click", () => {
    if (imageInput) {
      imageInput.value = "";
    }
    updatePreview("");
    setFeedback(productFeedback, "La imagen se quitara al guardar.");
  });

  resetButton?.addEventListener("click", () => resetProductForm());

  productForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = imageInput?.files?.[0];
    let nextImage = currentImage;

    if (file) {
      try {
        nextImage = await readImageAsDataUrl(file);
      } catch (error) {
        setFeedback(productFeedback, "No se pudo procesar la imagen.", true);
        return;
      }
    }

    const idField = productForm.elements.namedItem("id").value.trim();
    const name = productForm.elements.namedItem("name").value.trim();
    const tag = productForm.elements.namedItem("tag").value.trim();
    const description = productForm.elements.namedItem("description").value.trim();
    const price = Number(productForm.elements.namedItem("price").value);
    const available = productForm.elements.namedItem("availability").value === "available";

    const product = {
      id: idField || `${slugify(name)}-${Date.now()}`,
      name,
      tag,
      description,
      price,
      image: nextImage,
      available
    };

    const products = loadProducts();
    const existingIndex = products.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }

    saveProducts(products);
    renderAdminProducts();
    renderCatalog();
    resetProductForm();
    setFeedback(productFeedback, "Producto guardado correctamente.");
  });

  passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentPassword = passwordForm.elements.namedItem("currentPassword").value;
    const newPassword = passwordForm.elements.namedItem("newPassword").value.trim();

    if (currentPassword !== getAdminPassword()) {
      setFeedback(passwordFeedback, "La clave actual no coincide.", true);
      return;
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    passwordForm.reset();
    setFeedback(passwordFeedback, "Clave actualizada correctamente.");
  });

  logoutButton?.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    syncView();
  });

  syncView();
};

renderCatalog();
initAdminPage();
