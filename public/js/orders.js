const mockOrders = [
  {
    id: '#2AED2',
    restaurant: 'Lanespan Pizza & Pub (Emeryville)',
    date: '23 Aug at 15:43',
    status: 'completed',
    items: [
      { name: 'Cantina Crispy Chicken', quantity: 1, price: 13.18 },
      { name: 'Choco Cookies', quantity: 1, price: 15.32 },
      { name: '1.5L Coca cola', quantity: 1, price: 10.0 },
    ],
    total: 38.5,
  },
  {
    id: '#1FG4B',
    restaurant: 'Burger House',
    date: '20 Aug at 12:30',
    status: 'cancelled',
    items: [
      { name: 'Double Cheese Burger', quantity: 2, price: 12.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 },
    ],
    total: 30.97,
  },
  {
    id: '#3KL9P',
    restaurant: 'Asian Fusion',
    date: '18 Aug at 19:15',
    status: 'completed',
    items: [
      { name: 'Pad Thai', quantity: 1, price: 14.5 },
      { name: 'Spring Rolls', quantity: 2, price: 8.0 },
    ],
    total: 22.5,
  },
];

let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadOrders();
  initTabs();
});

function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.orders-tabs .tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      loadOrders();
    });
  });
}

function loadOrders() {
  const ordersList = document.getElementById('ordersList');
  let filteredOrders = mockOrders;

  if (currentTab === 'ongoing') {
    filteredOrders = mockOrders.filter((order) => order.status === 'ongoing');
  } else if (currentTab === 'completed') {
    filteredOrders = mockOrders.filter((order) => order.status === 'completed');
  }

  if (filteredOrders.length === 0) {
    ordersList.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">📦</div>
                <h2>Aucune commande</h2>
                <p>Vous n'avez pas encore passé de commande</p>
                <a href="/" class="btn-primary">Découvrir les restaurants</a>
            </div>
        `;
    return;
  }

  ordersList.innerHTML = filteredOrders.map((order) => createOrderCard(order)).join('');
}

function createOrderCard(order) {
  const statusLabels = {
    ongoing: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };

  const itemsHTML = order.items
    .map(
      (item) => `
        <div class="order-item">
            <span class="order-item-name">${item.quantity}x ${item.name}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `,
    )
    .join('');

  return `
        <div class="order-card" style="border: 4px solid lightgray;">
            <div class="order-header">
                <div class="order-info">
                    <h3>${order.restaurant}</h3>
                    <div class="order-date">Commande ${order.id} • ${order.date}</div>
                </div>
                <div class="order-status ${order.status}">
                    ${statusLabels[order.status]}
                </div>
            </div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
                <div class="order-actions">
                    ${order.status === 'completed' ? '<button class="btn-reorder" onclick="reorder()">Recommander</button>' : ''}
                    <button class="auth-btn" onclick="viewReceipt()">Voir le reçu</button>
                </div>
            </div>
        </div>
    `;
}

function reorder() {
  showNotification('Articles ajoutés au panier!', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
}

function viewReceipt() {
  showNotification('Ouverture du reçu...', 'success');
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${type === 'success' ? 'var(--dark-green)' : 'var(--dark-red)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

