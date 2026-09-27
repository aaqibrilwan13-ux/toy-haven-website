/* =========================================================
   TOY HAVEN — checkout.js
   Renders the order summary, validates the checkout form,
   and on success stores the order, clears the cart and
   shows an animated confirmation.
   ========================================================= */

function renderOrderSummary() {
  const list = document.getElementById('orderSummaryList');
  const form = document.getElementById('checkoutForm');
  if (!list) return;

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = '<p style="color:var(--gray-mid)">Your cart is empty. <a href="products.html" style="color:var(--primary);font-weight:600;">Browse products</a> before checking out.</p>';
    if (form) {
      form.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(function (el) {
        el.disabled = true;
      });
    }
    return;
  }

  list.innerHTML = cart.map(function (item) {
    const product = getProductById(item.id);
    if (!product) return '';
    return (
      '<section class="order-summary-item">' +
        '<span>' + product.name + ' &times; ' + item.qty + '</span>' +
        '<span>' + formatPrice(product.price * item.qty) + '</span>' +
      '</section>'
    );
  }).join('');

  const totals = calculateCartTotal();
  document.getElementById('checkoutSubtotal').textContent = formatPrice(totals.subtotal);
  document.getElementById('checkoutDelivery').textContent = totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery);
  document.getElementById('checkoutTotal').textContent = formatPrice(totals.total);
}

/* ---------- FORM VALIDATION ---------- */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + 'Error');
  if (input) input.classList.add('invalid');
  if (error) {
    error.textContent = message;
    error.classList.add('show');
  }
}

function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(inputId + 'Error');
  if (input) input.classList.remove('invalid');
  if (error) {
    error.textContent = '';
    error.classList.remove('show');
  }
}

function validateCheckoutForm() {
  let isValid = true;
  ['fullName', 'email', 'address'].forEach(clearFieldError);
  document.getElementById('paymentError').classList.remove('show');

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;
  const paymentSelected = document.querySelector('input[name="payment"]:checked');

  if (!validateNotEmpty(fullName)) {
    showFieldError('fullName', 'Please enter your full name.');
    isValid = false;
  }

  if (!validateNotEmpty(email)) {
    showFieldError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!validateNotEmpty(address)) {
    showFieldError('address', 'Please enter your delivery address.');
    isValid = false;
  }

  if (!paymentSelected) {
    document.getElementById('paymentError').classList.add('show');
    isValid = false;
  }

  return isValid;
}

/* ---------- ORDER SUBMISSION ---------- */
function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return 'TH-' + Date.now().toString().slice(-6) + '-' + random;
}

function placeOrder(e) {
  e.preventDefault();

  if (getCart().length === 0) return;
  if (!validateCheckoutForm()) return;

  const cart = getCart();
  const totals = calculateCartTotal();
  const orderNumber = generateOrderNumber();

  const order = {
    orderNumber: orderNumber,
    date: new Date().toISOString(),
    customer: {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      payment: document.querySelector('input[name="payment"]:checked').value
    },
    items: cart.map(function (item) {
      const product = getProductById(item.id);
      return {
        id: item.id,
        name: product ? product.name : 'Unknown product',
        price: product ? product.price : 0,
        qty: item.qty
      };
    }),
    subtotal: totals.subtotal,
    delivery: totals.delivery,
    total: totals.total
  };

  const orders = readStorage(STORAGE_KEYS.ORDERS, []);
  orders.push(order);
  writeStorage(STORAGE_KEYS.ORDERS, orders);

  clearCart();

  document.getElementById('orderNumberDisplay').textContent = orderNumber;
  document.getElementById('successOverlay').classList.add('open');
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', placeOrder);
}

document.addEventListener('DOMContentLoaded', function () {
  renderOrderSummary();
  initCheckoutForm();
});
