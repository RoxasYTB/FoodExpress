async function loadHeader() {
  try {
    const response = await fetch('/header.html');
    const html = await response.text();

    let headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      headerPlaceholder = document.createElement('div');
      headerPlaceholder.id = 'header-placeholder';
      document.body.insertBefore(headerPlaceholder, document.body.firstChild);
    }

    headerPlaceholder.innerHTML = html;

    initHeaderEvents();
  } catch (error) {
    console.error('Erreur lors du chargement du header:', error);
  }
}

function initHeaderEvents() {
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    updateCartCount();
    cartBtn.addEventListener('click', () => {
      window.location.href = '/orders.html';
    });
  }

  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    const token = localStorage.getItem('token');
    if (token) {
      authBtn.textContent = 'Mon compte';
      authBtn.addEventListener('click', () => {
        window.location.href = '/admin.html';
      });
    } else {
      authBtn.textContent = 'Connexion';
      authBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.classList.add('active');
        } else {
          window.location.href = '/#login';
        }
      });
    }
  }

  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.toggle-btn').forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  loadHeader();
}

