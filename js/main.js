/* =========================================================
   TOY HAVEN — main.js
   Shared utilities used across every page (navigation,
   cart, wishlist, toast, validation, scroll reveal) PLUS
   the home page (index.html) specific logic: hero slider,
   category links, featured products, product of the day,
   "Why Choose Us" and the newsletter form.
   ========================================================= */

/* ---------- PWA: SERVICE WORKER REGISTRATION ----------
   Registered here so every page gets offline caching.
   Skipped automatically on file:// (unsupported) so local
   testing without a server never throws a console error. */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    });
  }
}
registerServiceWorker();

/* ---------- LOCAL STORAGE KEYS ---------- */
const STORAGE_KEYS = {
  CART: 'toyHavenCart',
  WISHLIST: 'toyHavenWishlist',
  ORDERS: 'toyHavenOrders',
  NEWSLETTER: 'toyHavenNewsletter',
  FEEDBACK: 'toyHavenFeedback'
};

/* ---------- GENERIC STORAGE HELPERS ---------- */
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error('Could not read from localStorage for key:', key, err);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('Could not write to localStorage for key:', key, err);
    return false;
  }
}

/* ---------- PRICE FORMATTING ---------- */
function formatPrice(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-LK');
}

/* ---------- PRODUCT LOOKUP (products.js defines window.PRODUCTS) ---------- */
function getProductById(id) {
  const products = window.PRODUCTS || [];
  return products.find(function (p) { return p.id === Number(id); });
}

/* =========================================================
   CART FUNCTIONS
   ========================================================= */
function getCart() {
  return readStorage(STORAGE_KEYS.CART, []);
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.CART, cart);
  updateCartCount();
}

function addToCart(productId, qty) {
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === productId; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast('Added to cart', 'success');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(function (item) { return item.id !== productId; });
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function calculateCartTotal() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach(function (item) {
    const product = getProductById(item.id);
    if (product) subtotal += product.price * item.qty;
  });
  const delivery = cart.length === 0 ? 0 : (subtotal >= 15000 ? 0 : 500);
  return {
    subtotal: subtotal,
    delivery: delivery,
    total: subtotal + delivery
  };
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-count').forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* =========================================================
   WISHLIST FUNCTIONS
   Each wishlist entry: { id, status } where status is
   'interested' | 'owned' | 'not-interested'
   ========================================================= */
function getWishlist() {
  return readStorage(STORAGE_KEYS.WISHLIST, []);
}

function saveWishlist(list) {
  writeStorage(STORAGE_KEYS.WISHLIST, list);
  updateWishlistCount();
}

function isInWishlist(productId) {
  return getWishlist().some(function (i) { return i.id === productId; });
}

function addToWishlist(productId, status) {
  const list = getWishlist();
  const existing = list.find(function (i) { return i.id === productId; });
  if (existing) {
    existing.status = status || existing.status;
  } else {
    list.push({ id: productId, status: status || 'interested' });
  }
  saveWishlist(list);
  document.querySelectorAll('.product-card__wishlist-btn[data-id="' + productId + '"]').forEach(function (btn) {
    btn.classList.add('active');
  });
  showToast('Added to wishlist', 'success');
}

function toggleWishlist(productId) {
  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
    document.querySelectorAll('.product-card__wishlist-btn[data-id="' + productId + '"]').forEach(function (btn) {
      btn.classList.remove('active');
    });
    showToast('Removed from wishlist', 'success');
  } else {
    addToWishlist(productId, 'interested');
  }
}

function removeFromWishlist(productId) {
  let list = getWishlist();
  list = list.filter(function (i) { return i.id !== productId; });
  saveWishlist(list);
}

function updateWishlistStatus(productId, status) {
  const list = getWishlist();
  const item = list.find(function (i) { return i.id === productId; });
  if (item) {
    item.status = status;
    saveWishlist(list);
  }
}

function updateWishlistCount() {
  const count = getWishlist().length;
  document.querySelectorAll('.wishlist-count').forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* =========================================================
   VALIDATION HELPERS
   ========================================================= */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

function validateNotEmpty(value) {
  return String(value || '').trim().length > 0;
}

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
function showToast(message, type) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('section');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'success' ? ' success' : '');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2600);
}

/* =========================================================
   REUSABLE PRODUCT CARD RENDERER
   Used on both index.html (featured products) and
   products.html (full catalogue).
   ========================================================= */
function createProductCardHTML(product) {
  const inWishlist = isInWishlist(product.id);
  let stockLabel = 'In Stock';
  let stockClass = 'in-stock';
  if (product.stock === 0) {
    stockLabel = 'Out of Stock';
    stockClass = 'out-stock';
  } else if (product.stock <= 5) {
    stockLabel = 'Low Stock';
    stockClass = 'low-stock';
  }

  return (
    '<article class="product-card reveal" data-id="' + product.id + '">' +
      '<section class="product-card__image-wrap">' +
        '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" ' +
          'onerror="this.onerror=null;this.src=\'https://placehold.co/400x400/174d51/FFFFFF?text=Toy+Haven\';">' +
        '<button class="product-card__wishlist-btn' + (inWishlist ? ' active' : '') + '" ' +
          'data-id="' + product.id + '" aria-label="Add ' + product.name + ' to wishlist" onclick="toggleWishlist(' + product.id + ')">&#9825;</button>' +
      '</section>' +
      '<section class="product-card__body">' +
        '<span class="product-card__category">' + product.category + '</span>' +
        '<h3 class="product-card__name">' + product.name + '</h3>' +
        '<span class="product-card__rating">' + '&#9733;'.repeat(Math.round(product.rating)) + ' <small>(' + product.rating + ')</small></span>' +
        '<span class="stock-badge ' + stockClass + '">' + stockLabel + '</span>' +
        '<span class="product-card__price">' + formatPrice(product.price) + '</span>' +
      '</section>' +
      '<section class="product-card__actions">' +
        '<button class="btn btn-ghost" onclick="showProductModal(' + product.id + ')">View</button>' +
        '<button class="btn btn-solid" ' + (product.stock === 0 ? 'disabled' : '') + ' onclick="addToCart(' + product.id + ', 1)">Add to Cart</button>' +
      '</section>' +
    '</article>'
  );
}

/* =========================================================
   NAVIGATION: hamburger menu + active link highlight
   ========================================================= */
function initNav() {
  const toggle = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!links.classList.contains('open')) return;
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight the active page in the nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* =========================================================
   SCROLL REVEAL ANIMATION (IntersectionObserver)
   ========================================================= */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { observer.observe(el); });
}

/* Re-run reveal observation whenever new cards get injected dynamically */
function refreshScrollReveal() {
  initScrollReveal();
}

/* =========================================================
   HOME PAGE: HERO SLIDER
   ========================================================= */
function initHeroSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = slider.querySelector('.slider-dots');
  const prevBtn = slider.querySelector('.slider-btn.prev');
  const nextBtn = slider.querySelector('.slider-btn.next');
  let current = 0;
  let timer;

  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, 4500);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

  // Pause on hover / keyboard focus for accessibility
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  startAutoplay();
}

/* =========================================================
   HOME PAGE: CATEGORY CARDS -> products.html?category=
   ========================================================= */
function initCategoryLinks() {
  document.querySelectorAll('[data-category-link]').forEach(function (card) {
    card.addEventListener('click', function () {
      const category = card.getAttribute('data-category-link');
      window.location.href = 'products.html?category=' + encodeURIComponent(category);
    });
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* =========================================================
   HOME PAGE: FEATURED PRODUCTS
   ========================================================= */
function renderFeaturedProducts() {
  const wrap = document.getElementById('featuredProductsGrid');
  if (!wrap) return;
  const products = (window.PRODUCTS || []).filter(function (p) { return p.featured; }).slice(0, 8);
  wrap.innerHTML = products.map(createProductCardHTML).join('');
  refreshScrollReveal();
}

/* =========================================================
   HOME PAGE: PRODUCT OF THE DAY
   Deterministic pick based on the day of the year, so it
   changes daily but stays the same all day.
   ========================================================= */
function getProductOfTheDay() {
  const products = window.PRODUCTS || [];
  if (products.length === 0) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % products.length;
  return products[index];
}

function renderProductOfTheDay() {
  const wrap = document.getElementById('productOfTheDay');
  if (!wrap) return;
  const product = getProductOfTheDay();
  if (!product) return;

  wrap.innerHTML =
    '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" ' +
      'onerror="this.onerror=null;this.src=\'https://placehold.co/500x500/174d51/FFFFFF?text=Toy+Haven\';">' +
    '<section class="potd-details">' +
      '<span class="product-card__category">' + product.category + '</span>' +
      '<h3>' + product.name + '</h3>' +
      '<span class="product-card__rating">' + '&#9733;'.repeat(Math.round(product.rating)) + ' <small>(' + product.rating + ')</small></span>' +
      '<p class="desc">' + product.description + '</p>' +
      '<span class="price">' + formatPrice(product.price) + '</span>' +
      '<section class="potd-actions">' +
        '<button class="btn btn-solid" onclick="addToCart(' + product.id + ', 1)">Add to Cart</button>' +
        '<button class="btn btn-outline-dark" onclick="toggleWishlist(' + product.id + ')">Add to Wishlist</button>' +
      '</section>' +
    '</section>';
}

/* =========================================================
   HOME PAGE: NEWSLETTER FORM
   ========================================================= */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const message = form.querySelector('.form-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = input.value.trim();

    if (!validateEmail(email)) {
      message.textContent = 'Please enter a valid email address.';
      message.className = 'form-message error';
      return;
    }

    const subscribers = readStorage(STORAGE_KEYS.NEWSLETTER, []);
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      writeStorage(STORAGE_KEYS.NEWSLETTER, subscribers);
    }

    message.textContent = 'Thanks for subscribing! Check your inbox for toy-filled updates.';
    message.className = 'form-message success';
    form.reset();
  });
}

/* =========================================================
   INIT (runs on every page)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  initNav();
  updateCartCount();
  updateWishlistCount();
  initScrollReveal();

  // Home page only — these functions safely no-op on other pages
  initHeroSlider();
  initCategoryLinks();
  renderFeaturedProducts();
  renderProductOfTheDay();
  initNewsletterForm();

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
