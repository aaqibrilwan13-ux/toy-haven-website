/* =========================================================
   TOY HAVEN — products.js
   Product catalogue data + all logic for products.html
   (search, category filter, sorting, product modal).
   Also supplies window.PRODUCTS to index.html for the
   featured products section and product of the day.
   ========================================================= */

/* ---------- PRODUCT DATA (20+ realistic products) ---------- */
const PRODUCTS = [
  // ---- FIGURINES ----
  { id: 1, name: 'Web Hero Collectible Figure', category: 'Figurines', price: 4500, image: 'images/products/Web Hero Collectible Figure.JPG', description: 'A finely detailed 7-inch collectible figurine with articulated joints and a display base, perfect for any hero collection.', rating: 4.8, stock: 12, featured: true },
  { id: 2, name: 'Galactic Knight Action Figure', category: 'Figurines', price: 5200, image: 'images/products/Galactic Knight Action Figure.jpg', description: 'Premium sculpted armour with light-up chest core and interchangeable hands for dynamic posing.', rating: 4.6, stock: 8, featured: true },
  { id: 3, name: 'Shadow Ninja Vinyl Figure', category: 'Figurines', price: 2800, image: 'images/products/Shadow Ninja Vinyl Figure.jpg', description: 'A stylised matte-finish vinyl figure with removable cloth cape, limited numbered edition.', rating: 4.4, stock: 20, featured: false },
  { id: 4, name: 'Mystic Dragon Display Statue', category: 'Figurines', price: 8900, image: 'images/products/Mystic Dragon Display Statue.jpg', description: 'Hand-painted resin statue capturing a dragon mid-roar, a centrepiece for any shelf.', rating: 4.9, stock: 4, featured: true },
  { id: 5, name: 'Retro Robo Chibi Figure', category: 'Figurines', price: 1900, image: 'images/products/Retro Robo Mini Figure.jpg', description: 'A cute chibi-style die-cast robot figure with spring-loaded punching action.', rating: 4.3, stock: 25, featured: false },
  { id: 6, name: 'Guardian Sentinel Statue', category: 'Figurines', price: 6700, image: 'images/products/Guardian Sentinel Statue.jpg', description: 'A museum-quality armoured guardian statue with weathered metallic paint detailing.', rating: 4.7, stock: 6, featured: false },

  // ---- TOYS ----
  { id: 7, name: 'Rex the Roaring Dinosaur', category: 'Toys', price: 3200, image: 'images/products/Roaring T-Rex Dinosaur Toy.jpg', description: 'A soft-touch walking dinosaur toy with roaring sound effects and glowing eyes.', rating: 4.5, stock: 15, featured: true },
  { id: 8, name: 'Rainbow Building Block Set (300pc)', category: 'Toys', price: 4100, image: 'images/products/Creative Building Blocks 300pc.jpg', description: 'A 300-piece interlocking block set for building towers, vehicles and creatures.', rating: 4.7, stock: 18, featured: true },
  { id: 9, name: 'Cosmic Blaster Water Gun', category: 'Toys', price: 1500, image: 'images/products/Mega Splash Water Blaster.jpg', description: 'A high-capacity water blaster with a 9-metre range, perfect for backyard battles.', rating: 4.2, stock: 30, featured: false },
  { id: 10, name: 'Wind-Up Tin Robot', category: 'Toys', price: 2200, image: 'images/products/Classic Wind-Up Robot.jpg', description: 'A nostalgic wind-up walking tin robot with sparking chest light, no batteries needed.', rating: 4.4, stock: 10, featured: false },
  { id: 11, name: 'Plush Bear Cuddle Buddy', category: 'Toys', price: 2600, image: 'images/products/Soft Teddy Bear 40cm.jpg', description: 'An ultra-soft 40cm plush teddy bear made from hypoallergenic fabric.', rating: 4.9, stock: 22, featured: true },
  { id: 12, name: 'Remote Control Stunt Buggy', category: 'Toys', price: 7300, image: 'images/products/RC Stunt Buggy.jpg', description: 'An all-terrain RC buggy with flip recovery, 20-minute battery life and dual-speed control.', rating: 4.6, stock: 9, featured: false },

  // ---- BOARD GAMES ----
  { id: 13, name: 'Kingdom Builders Strategy Game', category: 'Board Games', price: 5400, image: 'images/products/Kingdom Quest Strategy Game.jpg', description: 'A 2-5 player strategy board game about founding and expanding your own kingdom.', rating: 4.8, stock: 14, featured: true },
  { id: 14, name: 'Word Sprint Party Game', category: 'Board Games', price: 2900, image: 'images/products/Word Rush Party Game.jpg', description: 'A fast-paced word-guessing party game for 3-8 players, perfect for family nights.', rating: 4.5, stock: 20, featured: false },
  { id: 15, name: 'Galaxy Traders Card Game', category: 'Board Games', price: 3600, image: 'images/products/Galactic Traders Card Game.jpg', description: 'A strategic card-trading game set across the stars, quick to learn and hard to master.', rating: 4.6, stock: 16, featured: true },
  { id: 16, name: 'Mystery Manor Detective Game', category: 'Board Games', price: 4800, image: 'images/products/Mystery Manor Detective Game.jpg', description: 'A cooperative mystery-solving board game where players gather clues to catch the culprit.', rating: 4.7, stock: 11, featured: false },
  { id: 17, name: 'Classic Chess & Checkers Set', category: 'Board Games', price: 3300, image: 'images/products/Wooden Chess & Checkers Set.jpg', description: 'A handcrafted wooden chess and checkers set with a magnetic folding board.', rating: 4.9, stock: 17, featured: false },

  // ---- DIECAST CARS ----
  { id: 18, name: 'Turbo GT Diecast Racer 1:24', category: 'Diecast Cars', price: 4700, image: 'images/products/Turbo GT Diecast Car.jpg', description: 'A precision die-cast 1:24 scale racer with opening doors and detailed engine bay.', rating: 4.7, stock: 13, featured: true },
  { id: 19, name: 'Vintage Roadster Model 1:18', category: 'Diecast Cars', price: 6200, image: 'images/products/Vintage Roadster Model.jpg', description: 'A collector-grade 1:18 scale replica of a classic roadster with chrome detailing.', rating: 4.8, stock: 7, featured: true },
  { id: 20, name: 'Rally Rock Off-Roader 1:20', category: 'Diecast Cars', price: 3900, image: 'images/products/Rally Off-Road Diecast.jpg', description: 'A rugged die-cast off-road rally car with working suspension and knobby tyres.', rating: 4.5, stock: 15, featured: false },
  { id: 21, name: 'City Fleet Fire Engine 1:32', category: 'Diecast Cars', price: 3100, image: 'images/products/City Fire Engine Diecast.jpg', description: 'A detailed die-cast fire engine with extendable ladder and rolling wheels.', rating: 4.4, stock: 19, featured: false },
  { id: 22, name: 'Formula Speedster Racer 1:24', category: 'Diecast Cars', price: 5300, image: 'images/products/Formula Racer Diecast.jpg', description: 'An aerodynamic die-cast formula race car finished in gloss racing livery with driver figure.', rating: 4.6, stock: 5, featured: false }
];

window.PRODUCTS = PRODUCTS;

/* ---------- STATE for products.html ---------- */
let currentFilter = 'All';
let currentSort = 'default';
let currentSearch = '';

/* ---------- RENDER GRID ---------- */
function getFilteredProducts() {
  let list = PRODUCTS.slice();

  if (currentFilter !== 'All') {
    list = list.filter(function (p) { return p.category === currentFilter; });
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.trim().toLowerCase();
    list = list.filter(function (p) { return p.name.toLowerCase().includes(q); });
  }

  switch (currentSort) {
    case 'price-asc':
      list.sort(function (a, b) { return a.price - b.price; });
      break;
    case 'price-desc':
      list.sort(function (a, b) { return b.price - a.price; });
      break;
    case 'name-asc':
      list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      break;
    case 'rating':
      list.sort(function (a, b) { return b.rating - a.rating; });
      break;
    default:
      break; // keep original catalogue order
  }

  return list;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  const list = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';
  grid.innerHTML = list.map(createProductCardHTML).join('');
  if (typeof refreshScrollReveal === 'function') refreshScrollReveal();

  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = list.length + ' product' + (list.length !== 1 ? 's' : '') + ' found';
}

/* ---------- SEARCH ---------- */
function initSearch() {
  const input = document.getElementById('productSearch');
  if (!input) return;
  input.addEventListener('input', function () {
    currentSearch = input.value;
    renderProducts();
  });
}

/* ---------- CATEGORY FILTER ---------- */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (buttons.length === 0) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      renderProducts();
    });
  });

  // Support ?category= from home page category cards
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  if (categoryParam) {
    const match = Array.from(buttons).find(function (b) { return b.dataset.category === categoryParam; });
    if (match) {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      match.classList.add('active');
      currentFilter = categoryParam;
    }
  }
}

/* ---------- SORTING ---------- */
function initSort() {
  const select = document.getElementById('sortSelect');
  if (!select) return;
  select.addEventListener('change', function () {
    currentSort = select.value;
    renderProducts();
  });
}

/* ---------- PRODUCT MODAL ---------- */
function showProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let overlay = document.getElementById('productModal');
  if (!overlay) {
    overlay = document.createElement('section');
    overlay.id = 'productModal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modalProductName');
    document.body.appendChild(overlay);
  }

  let stockLabel = 'In Stock';
  let stockClass = 'in-stock';
  if (product.stock === 0) {
    stockLabel = 'Out of Stock';
    stockClass = 'out-stock';
  } else if (product.stock <= 5) {
    stockLabel = 'Low Stock — ' + product.stock + ' left';
    stockClass = 'low-stock';
  }

  overlay.innerHTML =
    '<section class="modal-box">' +
      '<button class="modal-close" aria-label="Close product details">&times;</button>' +
      '<img src="' + product.image + '" alt="' + product.name + '" ' +
        'onerror="this.onerror=null;this.src=\'https://placehold.co/500x500/174d51/FFFFFF?text=Toy+Haven\';">' +
      '<section class="modal-details">' +
        '<span class="product-card__category">' + product.category + '</span>' +
        '<h2 id="modalProductName">' + product.name + '</h2>' +
        '<span class="product-card__rating">' + '&#9733;'.repeat(Math.round(product.rating)) + ' <small>(' + product.rating + ' / 5)</small></span>' +
        '<span class="stock-badge ' + stockClass + '">' + stockLabel + '</span>' +
        '<span class="price">' + formatPrice(product.price) + '</span>' +
        '<p class="desc">' + product.description + '</p>' +
        '<section class="modal-actions">' +
          '<button class="btn btn-solid" ' + (product.stock === 0 ? 'disabled' : '') + ' onclick="addToCart(' + product.id + ', 1); closeProductModal();">Add to Cart</button>' +
          '<button class="btn btn-outline-dark" onclick="toggleWishlist(' + product.id + ')">Add to Wishlist</button>' +
        '</section>' +
      '</section>' +
    '</section>';

  requestAnimationFrame(function () { overlay.classList.add('open'); });

  overlay.querySelector('.modal-close').addEventListener('click', closeProductModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeProductModal();
  });

  document.addEventListener('keydown', modalEscHandler);
}

function modalEscHandler(e) {
  if (e.key === 'Escape') closeProductModal();
}

function closeProductModal() {
  const overlay = document.getElementById('productModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.removeEventListener('keydown', modalEscHandler);
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initFilters();
  initSearch();
  initSort();
  renderProducts();
});
