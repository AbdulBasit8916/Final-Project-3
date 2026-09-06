// Cart items array
let cart = [];

// Toggle Cart Drawer
function toggleCart() {
  const overlay = document.querySelector('.drawer-overlay');
  const drawer = document.querySelector('.cart-drawer');
  
  if (overlay && drawer) {
    overlay.classList.toggle('active');
    drawer.classList.toggle('active');
  }
}

// Add Item to Cart
function addToCart(name, price, img) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      img: img,
      quantity: 1
    });
  }
  
  updateCartUI();
  toggleCart();
}

// Remove Item from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Update Cart UI
function updateCartUI() {
  const cartContainer = document.querySelector('.cart-items');
  const cartBadge = document.querySelector('.cart-count');
  
  if (!cartContainer) return;

  // Update total items count in badge
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }

  // Clear container
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="text-center text-muted my-4">Your cart is empty.</p>';
    return;
  }

  // Render items
  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'd-flex align-items-center justify-content-between mb-3 pb-2 border-bottom';
    itemElement.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
        <div>
          <h6 class="mb-0" style="font-size: 0.9rem;">${item.name}</h6>
          <small class="text-muted">Rs. ${item.price} x ${item.quantity}</small>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
        <i class="bi bi-trash"></i>
      </button>
    `;
    cartContainer.appendChild(itemElement);
  });
}

// Form Submission with Strict Email and Password Validation
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorElement = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Clear previous errors
      if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
      }

      // Email Format Verification (@ and . check)
      const hasAtSymbol = email.includes('@');
      const hasDotSymbol = email.includes('.');

      if (!hasAtSymbol || !hasDotSymbol) {
        showError('Please enter a valid email containing both "@" and "."');
        return;
      }

      // Password Length Verification (Min 8 characters)
      if (password.length < 8) {
        showError('Password must be at least 8 characters long.');
        return;
      }

      // Success Callback
      alert('Login Successful!');
      
      // Close Bootstrap modal programmatically
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      loginForm.reset();
    });
  }

  function showError(message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    } else {
      alert(message);
    }
  }
});