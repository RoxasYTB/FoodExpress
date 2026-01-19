const API_BASE = '/api';
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let restaurants = [];

document.addEventListener('DOMContentLoaded', () => {
  loadRestaurants();
  initEventListeners();
  checkAuth();
  updateCartUI();
});

function initEventListeners() {
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', handleAuthClick);
  }

  const closeLoginBtn = document.getElementById('closeLoginModal');
  const closeSignupBtn = document.getElementById('closeSignupModal');

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => closeModal('loginModal'));
  }

  if (closeSignupBtn) {
    closeSignupBtn.addEventListener('click', () => closeModal('signupModal'));
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  const switchToSignup = document.getElementById('switchToSignup');
  if (switchToSignup) {
    switchToSignup.addEventListener('click', () => {
      closeModal('loginModal');
      openModal('signupModal');
    });
  }

  const switchToLogin = document.getElementById('switchToLogin');
  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
      closeModal('signupModal');
      openModal('loginModal');
    });
  }

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      alert('Panier: ' + totalItems + ' articles');
    });
  }
}

function handleAuthClick() {
  if (currentUser) {
    logout();
  } else {
    openModal('loginModal');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      currentUser = data.user;
      updateAuthUI();
      closeModal('loginModal');
      showNotification('Connexion réussie!', 'success');
    } else {
      showNotification('Email ou mot de passe incorrect', 'error');
    }
  } catch (error) {
    showNotification('Erreur de connexion', 'error');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      showNotification('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success');
      closeModal('signupModal');
      openModal('loginModal');
    } else {
      const error = await response.json();
      showNotification(error.message || "Erreur lors de l'inscription", 'error');
    }
  } catch (error) {
    showNotification("Erreur lors de l'inscription", 'error');
  }
}

function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    currentUser = { username: 'Utilisateur' };
    updateAuthUI();
  }
}

function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  if (authBtn && currentUser) {
    authBtn.textContent = currentUser.username || 'Mon compte';
  }
}

function logout() {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    localStorage.removeItem('token');
    currentUser = null;
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
      authBtn.textContent = 'Connexion';
    }
    showNotification('Déconnexion réussie', 'success');
  }
}

async function loadRestaurants() {
  try {
    const response = await fetch(`${API_BASE}/restaurants`);
    if (!response.ok) throw new Error('Erreur lors du chargement');

    restaurants = await response.json();
    displayRestaurants();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function displayRestaurants() {
  const container = document.getElementById('restaurantsContainer');

  if (!container) return;

  if (!restaurants || restaurants.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-illustration">
          <div class="avocado"><div class="seed"></div></div>
        </div>
        <h3 class="empty-title">Aucun restaurant disponible</h3>
        <p class="empty-message">Revenez plus tard pour découvrir nos restaurants partenaires</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="restaurants-grid">
      ${restaurants
        .map(
          (restaurant) => `
        <div class="restaurant-card" onclick="goToRestaurant(${restaurant.id})">
          <div class="restaurant-image">🍽️</div>
          <div class="restaurant-info">
            <div class="restaurant-name">${restaurant.name}</div>
            <div class="restaurant-address">📍 ${restaurant.address}</div>
            <div class="restaurant-hours">🕒 ${restaurant.opening_hours}</div>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function goToRestaurant(id) {
  window.location.href = `/restaurant.html?id=${id}`;
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = totalItems;
    countEl.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#06c167' : '#ff6b7a';

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

