/* =========================================================
   TOY HAVEN — cart.js
   Renders the shopping cart, wires up quantity controls,
   remove buttons, clear cart and the summary totals.
   ========================================================= */

function renderCartPage() {
  const listWrap = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
  const summary = document.getElementById('cartSummaryBox');
  if (!listWrap) return;

  const cart = getCart();

  if (cart.length === 0) {
    listWrap.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (summary) summary.style.display = 'block';

  listWrap.innerHTML = cart.map(function (item) {
    const product = getProductById(item.id);
    if (!product) return '';
    const subtotal = product.price * item.qty;
    return (
      '<section class="cart-item reveal visible" data-id="' + product.id + '">' +
        '<img src="' + product.image + '" alt="' + product.name + '" ' +
          'onerror="this.onerror=null;this.src=\'https://placehold.co/100x100/174d51/FFFFFF?text=Toy\';">' +
        '<section class="cart-item__info">' +
          '<section class="cart-item__name">' + product.name + '</section>' +
          '<section class="cart-item__category">' + product.category + ' &middot; ' + formatPrice(product.price) + '</section>' +
        '</section>' +
        '<section class="qty-control">' +
          '<button type="button" aria-label="Decrease quantity" onclick="changeCartQty(' + product.id + ', -1)">&minus;</button>' +
          '<input type="number" min="1" value="' + item.qty + '" aria-label="Quantity for ' + product.name + '" onchange="setCartQty(' + product.id + ', this.value)">' +
          '<button type="button" aria-label="Increase quantity" onclick="changeCartQty(' + product.id + ', 1)">+</button>' +
        '</section>' +
        '<section class="cart-item__subtotal">' + formatPrice(subtotal) + '</section>' +
        '<button class="remove-btn" aria-label="Remove ' + product.name + ' from cart" onclick="removeCartItem(' + product.id + ')">&times;</button>' +
      '</section>'
    );
  }).join('');

  renderCartSummary();
}

function renderCartSummary() {
  const totals = calculateCartTotal();
  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDelivery');
  const totalEl = document.getElementById('cartTotal');

  if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
  if (deliveryEl) deliveryEl.textContent = totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery);
  if (totalEl) totalEl.textContent = formatPrice(totals.total);
}

function changeCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  updateCartQty(productId, item.qty + delta);
  renderCartPage();
}

function setCartQty(productId, value) {
  const qty = Math.max(1, parseInt(value, 10) || 1);
  updateCartQty(productId, qty);
  renderCartPage();
}

function removeCartItem(productId) {
  removeFromCart(productId);
  renderCartPage();
  showToast('Item removed from cart', 'success');
}

function initClearCartButton() {
  const btn = document.getElementById('clearCartBtn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (getCart().length === 0) return;
    if (confirm('Remove all items from your cart?')) {
      clearCart();
      renderCartPage();
      showToast('Cart cleared', 'success');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderCartPage();
  initClearCartButton();
});
