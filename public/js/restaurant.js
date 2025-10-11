const API_BASE = '/api';
let restaurantId = null;
let restaurant = null;
let menus = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  restaurantId = urlParams.get('id');

  if (!restaurantId) {
    window.location.href = '/';
    return;
  }

  loadRestaurant();
  loadMenus();
  initEventListeners();
  updateCartUI();
});

function initEventListeners() {
  document.getElementById('cartFab').addEventListener('click', openCart);
  document.getElementById('closeCartModal').addEventListener('click', closeCart);
  document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

async function loadRestaurant() {
  try {
    const response = await fetch(`${API_BASE}/restaurants/${restaurantId}`);
    if (!response.ok) throw new Error('Restaurant non trouvé');

    restaurant = await response.json();
    displayRestaurant();
  } catch (error) {
    alert('Restaurant non trouvé');
    window.location.href = '/';
  }
}

function displayRestaurant() {
  const container = document.getElementById('restaurantInfo');
  container.innerHTML = `
    <h1 class="restaurant-name">${restaurant.name}</h1>
    <div class="restaurant-details">
      <div class="detail-item">
        <span>📍</span>
        <span>${restaurant.address}</span>
      </div>
      <div class="detail-item">
        <span>📞</span>
        <span>${restaurant.phone}</span>
      </div>
      <div class="detail-item">
        <span>🕒</span>
        <span>${restaurant.opening_hours}</span>
      </div>
    </div>
  `;
  document.title = `${restaurant.name} - FoodExpress`;
}

async function loadMenus() {
  try {
    const response = await fetch(`${API_BASE}/menus?restaurant_id=${restaurantId}`);
    if (!response.ok) throw new Error('Erreur lors du chargement');

    menus = await response.json();
    displayMenus();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function displayMenus() {
  const container = document.getElementById('menusContainer');

  if (menus.length === 0) {
    container.innerHTML = '<div class="empty-cart"><div class="empty-cart-icon">📋</div><p>Aucun menu disponible pour le moment</p></div>';
    return;
  }

  const categories = [...new Set(menus.map((m) => m.category))];

  container.innerHTML = categories
    .map((category) => {
      const categoryMenus = menus.filter((m) => m.category === category);
      return `
      <div class="category-section">
        <h3 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <div class="menu-grid">
          ${categoryMenus
            .map(
              (menu) => `
            <div class="menu-card">
              <div class="menu-name">${menu.name}</div>
              <div class="menu-description">${menu.description}</div>
              <div class="menu-footer">
                <div class="menu-price">${menu.price}€</div>
                <button class="add-to-cart-btn" onclick="addToCart(${menu.id})">Ajouter</button>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `;
    })
    .join('');
}

function addToCart(menuId) {
  const menu = menus.find((m) => m.id === menuId);
  if (!menu) return;

  const existingItem = cart.find((item) => item.id === menuId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  }

  saveCart();
  updateCartUI();
  showNotification('Ajouté au panier');
}

function removeFromCart(menuId) {
  const itemIndex = cart.findIndex((item) => item.id === menuId);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
    displayCart();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = totalItems;
  countEl.style.display = totalItems > 0 ? 'flex' : 'none';
}

function openCart() {
  displayCart();
  document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
  document.getElementById('cartModal').classList.remove('active');
}

function displayCart() {
  const container = document.getElementById('cartItems');

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart"><div class="empty-cart-icon">🛒</div><p>Votre panier est vide</p></div>';
    document.getElementById('cartTotalAmount').textContent = '0€';
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price}€</div>
      </div>
      <div class="cart-item-controls">
        <button class="quantity-btn" onclick="removeFromCart(${item.id})">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="addToCart(${item.id})">+</button>
      </div>
    </div>
  `,
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('cartTotalAmount').textContent = `${total.toFixed(2)}€`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Veuillez vous connecter pour commander');
    window.location.href = '/?login=true';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Commande confirmée!\nTotal: ${total.toFixed(2)}€\n\nVotre commande est en cours de préparation.`);

  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #06c167;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

