/* =========================================================
   TOY HAVEN — wishlist.js
   Renders the wishlist/collection page, lets users set a
   status per item (Interested / Owned / Not Interested),
   filter by status, remove items, or move them to the cart.
   ========================================================= */

let wishlistStatusFilter = 'all';

function statusLabel(status) {
  switch (status) {
    case 'owned': return 'Owned';
    case 'not-interested': return 'Not Interested';
    default: return 'Interested';
  }
}

function statusClass(status) {
  switch (status) {
    case 'owned': return 'owned';
    case 'not-interested': return 'not-interested';
    default: return 'interested';
  }
}

function renderWishlistPage() {
  const listWrap = document.getElementById('wishlistItemsList');
  const emptyState = document.getElementById('wishlistEmptyState');
  if (!listWrap) return;

  let items = getWishlist();

  if (wishlistStatusFilter !== 'all') {
    items = items.filter(function (i) { return i.status === wishlistStatusFilter; });
  }

  if (getWishlist().length === 0) {
    listWrap.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  if (items.length === 0) {
    listWrap.innerHTML = '<section class="no-results"><p>No items match this filter.</p></section>';
    return;
  }

  listWrap.innerHTML = items.map(function (entry) {
    const product = getProductById(entry.id);
    if (!product) return '';
    return (
      '<section class="wishlist-item reveal visible" data-id="' + product.id + '">' +
        '<img src="' + product.image + '" alt="' + product.name + '" ' +
          'onerror="this.onerror=null;this.src=\'https://placehold.co/100x100/174d51/FFFFFF?text=Toy\';">' +
        '<section>' +
          '<section class="cart-item__name">' + product.name + '</section>' +
          '<section class="cart-item__category">' + product.category + ' &middot; ' + formatPrice(product.price) + '</section>' +
          '<span class="status-tag ' + statusClass(entry.status) + '" style="margin-top:6px;">' + statusLabel(entry.status) + '</span>' +
        '</section>' +
        '<label class="visually-hidden" for="status-' + product.id + '">Status for ' + product.name + '</label>' +
        '<select class="status-select" id="status-' + product.id + '" onchange="changeWishlistStatus(' + product.id + ', this.value)">' +
          '<option value="interested"' + (entry.status === 'interested' ? ' selected' : '') + '>Interested</option>' +
          '<option value="owned"' + (entry.status === 'owned' ? ' selected' : '') + '>Owned</option>' +
          '<option value="not-interested"' + (entry.status === 'not-interested' ? ' selected' : '') + '>Not Interested</option>' +
        '</select>' +
        '<section class="wishlist-actions">' +
          '<button class="btn btn-solid" onclick="moveWishlistItemToCart(' + product.id + ')">Move to Cart</button>' +
          '<button class="remove-btn" aria-label="Remove ' + product.name + ' from wishlist" onclick="removeWishlistItem(' + product.id + ')">&times;</button>' +
        '</section>' +
      '</section>'
    );
  }).join('');
}

function changeWishlistStatus(productId, status) {
  updateWishlistStatus(productId, status);
  renderWishlistPage();
}

function removeWishlistItem(productId) {
  removeFromWishlist(productId);
  renderWishlistPage();
  showToast('Removed from wishlist', 'success');
}

function moveWishlistItemToCart(productId) {
  addToCart(productId, 1);
  removeFromWishlist(productId);
  renderWishlistPage();
}

function initWishlistFilters() {
  const buttons = document.querySelectorAll('.wishlist-filter-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      wishlistStatusFilter = btn.dataset.status;
      renderWishlistPage();
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderWishlistPage();
  initWishlistFilters();
});
