const API_BASE = '/api';
let token = localStorage.getItem('token');
let currentUser = null;
let restaurants = [];
let menus = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initEventListeners();
});

function initEventListeners() {
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('addRestaurantBtn').addEventListener('click', () => openRestaurantModal());
  document.getElementById('addMenuBtn').addEventListener('click', () => openMenuModal());
  document.getElementById('closeRestaurantModal').addEventListener('click', closeRestaurantModal);
  document.getElementById('closeMenuModal').addEventListener('click', closeMenuModal);
  document.getElementById('cancelRestaurant').addEventListener('click', closeRestaurantModal);
  document.getElementById('cancelMenu').addEventListener('click', closeMenuModal);
  document.getElementById('restaurantForm').addEventListener('submit', handleRestaurantSubmit);
  document.getElementById('menuForm').addEventListener('submit', handleMenuSubmit);
}

async function checkAdminAuth() {
  if (!token) {
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Non autorisé');
    }

    loadUsers();
    loadRestaurants();
    loadMenus();
  } catch (error) {
    showNotification('Accès refusé. Vous devez être administrateur.', 'error');
    setTimeout(() => (window.location.href = '/'), 2000);
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors du chargement');

    const result = await response.json();
    const users = result.data || result;
    displayUsers(users);
  } catch (error) {
    showNotification('Erreur lors du chargement des utilisateurs', 'error');
  }
}

function displayUsers(users) {
  const tbody = document.getElementById('usersTableBody');

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Aucun utilisateur</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td>${user._id || user.id || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${user.username}</td>
      <td><span class="badge badge-${user.role}">${user.role}</span></td>
      <td>
        <div class="actions-cell">
          <button class="icon-btn" onclick="viewUser('${user._id || user.id}')" title="Voir">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn-danger" onclick="deleteUser('${user._id || user.id}')" title="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join('');
}

async function loadRestaurants() {
  try {
    const response = await fetch(`${API_BASE}/restaurants`);
    if (!response.ok) throw new Error('Erreur lors du chargement');

    const result = await response.json();
    restaurants = result.data || result;
    displayRestaurants(restaurants);
    updateRestaurantSelect();
  } catch (error) {
    showNotification('Erreur lors du chargement des restaurants', 'error');
  }
}

function displayRestaurants(restaurants) {
  const tbody = document.getElementById('restaurantsTableBody');

  if (restaurants.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>Aucun restaurant</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = restaurants
    .map(
      (restaurant) => `
    <tr>
      <td>${restaurant._id}</td>
      <td>${restaurant.name}</td>
      <td>${restaurant.address}</td>
      <td>${restaurant.phone}</td>
      <td>${restaurant.opening_hours}</td>
      <td>
        <div class="actions-cell">
          <button class="icon-btn" onclick="editRestaurant('${restaurant._id}')" title="Modifier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn-danger" onclick="deleteRestaurant('${restaurant._id}')" title="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join('');
}

async function loadMenus() {
  try {
    const response = await fetch(`${API_BASE}/menus`);
    if (!response.ok) throw new Error('Erreur lors du chargement');

    const result = await response.json();
    menus = result.data || result;
    displayMenus(menus);
  } catch (error) {
    showNotification('Erreur lors du chargement des menus', 'error');
  }
}

function displayMenus(menus) {
  const tbody = document.getElementById('menusTableBody');

  if (menus.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Aucun menu</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = menus
    .map((menu) => {
      const restaurant = restaurants.find((r) => r._id === menu.restaurant_id);
      return `
      <tr>
        <td>${menu._id}</td>
        <td>${restaurant ? restaurant.name : 'N/A'}</td>
        <td>${menu.name}</td>
        <td>${menu.description.substring(0, 50)}...</td>
        <td>${menu.price}€</td>
        <td>${menu.category}</td>
        <td>
          <div class="actions-cell">
            <button class="icon-btn" onclick="editMenu('${menu._id}')" title="Modifier">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="icon-btn icon-btn-danger" onclick="deleteMenu('${menu._id}')" title="Supprimer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');
}

function openRestaurantModal(restaurant = null) {
  document.getElementById('restaurantModalTitle').textContent = restaurant ? 'Modifier le restaurant' : 'Ajouter un restaurant';
  document.getElementById('restaurantId').value = restaurant ? restaurant._id : '';
  document.getElementById('restaurantName').value = restaurant ? restaurant.name : '';
  document.getElementById('restaurantAddress').value = restaurant ? restaurant.address : '';
  document.getElementById('restaurantPhone').value = restaurant ? restaurant.phone : '';
  document.getElementById('restaurantHours').value = restaurant ? restaurant.opening_hours : '';
  document.getElementById('restaurantModal').classList.add('active');
}

function closeRestaurantModal() {
  document.getElementById('restaurantModal').classList.remove('active');
  document.getElementById('restaurantForm').reset();
}

function openMenuModal(menu = null) {
  document.getElementById('menuModalTitle').textContent = menu ? 'Modifier le menu' : 'Ajouter un menu';
  document.getElementById('menuId').value = menu ? menu._id : '';
  document.getElementById('menuRestaurant').value = menu ? menu.restaurant_id : '';
  document.getElementById('menuName').value = menu ? menu.name : '';
  document.getElementById('menuDescription').value = menu ? menu.description : '';
  document.getElementById('menuPrice').value = menu ? menu.price : '';
  document.getElementById('menuCategory').value = menu ? menu.category : '';
  document.getElementById('menuModal').classList.add('active');
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.remove('active');
  document.getElementById('menuForm').reset();
}

function updateRestaurantSelect() {
  const select = document.getElementById('menuRestaurant');
  select.innerHTML = '<option value="">Sélectionner un restaurant</option>' + restaurants.map((r) => `<option value="${r._id}">${r.name}</option>`).join('');
}

async function handleRestaurantSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('restaurantId').value;
  const data = {
    name: document.getElementById('restaurantName').value,
    address: document.getElementById('restaurantAddress').value,
    phone: document.getElementById('restaurantPhone').value,
    opening_hours: document.getElementById('restaurantHours').value,
  };

  try {
    const url = id ? `${API_BASE}/restaurants/${id}` : `${API_BASE}/restaurants`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

    showNotification(`Restaurant ${id ? 'modifié' : 'créé'} avec succès`, 'success');
    closeRestaurantModal();
    loadRestaurants();
  } catch (error) {
    showNotification("Erreur lors de l'enregistrement", 'error');
  }
}

async function handleMenuSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('menuId').value;
  const data = {
    restaurant_id: parseInt(document.getElementById('menuRestaurant').value),
    name: document.getElementById('menuName').value,
    description: document.getElementById('menuDescription').value,
    price: parseFloat(document.getElementById('menuPrice').value),
    category: document.getElementById('menuCategory').value,
  };

  try {
    const url = id ? `${API_BASE}/menus/${id}` : `${API_BASE}/menus`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

    showNotification(`Menu ${id ? 'modifié' : 'créé'} avec succès`, 'success');
    closeMenuModal();
    loadMenus();
  } catch (error) {
    showNotification("Erreur lors de l'enregistrement", 'error');
  }
}

async function editRestaurant(id) {
  const restaurant = restaurants.find((r) => r.id === id);
  if (restaurant) {
    openRestaurantModal(restaurant);
  }
}

async function editRestaurant(id) {
  const restaurant = restaurants.find((r) => r._id === id);
  if (restaurant) {
    openRestaurantModal(restaurant);
  }
}

async function deleteRestaurant(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) return;

  try {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression');

    showNotification('Restaurant supprimé avec succès', 'success');
    loadRestaurants();
  } catch (error) {
    showNotification('Erreur lors de la suppression', 'error');
  }
}

async function editMenu(id) {
  const menu = menus.find((m) => m._id === id);
  if (menu) {
    openMenuModal(menu);
  }
}

async function deleteMenu(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) return;

  try {
    const response = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression');

    showNotification('Menu supprimé avec succès', 'success');
    loadMenus();
  } catch (error) {
    showNotification('Erreur lors de la suppression', 'error');
  }
}

async function viewUser(id) {
  try {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors du chargement');

    const user = await response.json();
    alert(`Utilisateur #${user.id}\nEmail: ${user.email}\nNom: ${user.username}\nRôle: ${user.role}`);
  } catch (error) {
    showNotification('Erreur lors du chargement', 'error');
  }
}

async function deleteUser(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

  try {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression');

    showNotification('Utilisateur supprimé avec succès', 'success');
    loadUsers();
  } catch (error) {
    showNotification('Erreur lors de la suppression', 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageEl = document.getElementById('notificationMessage');

  messageEl.textContent = message;
  notification.className = `notification show ${type}`;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

