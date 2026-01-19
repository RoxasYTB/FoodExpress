const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },

  app: {
    name: 'FoodExpress',
    description: 'Livraison de repas rapide',
    version: '1.0.0',
  },

  theme: {
    colors: {
      pastelRed: '#ffb3ba',
      pastelGreen: '#baffc9',
      pastelBlue: '#bae1ff',
      darkRed: '#ff6b7a',
      darkGreen: '#5fcd7a',
      darkBlue: '#6ba3ff',
    },
  },

  features: {
    enableNotifications: true,
    enableFavorites: true,
    enablePromotion: true,
    cartPersistence: false,
  },

  delivery: {
    defaultFee: 2.99,
    freeDeliveryThreshold: 20,
    estimatedTime: '20-30 min',
  },

  categories: [
    { id: 'american', name: 'American', icon: '🌭' },
    { id: 'grocery', name: 'Grocery', icon: '🛒', promo: true },
    { id: 'convenience', name: 'Convenience', icon: '🥤' },
    { id: 'alcohol', name: 'Alcohol', icon: '🍺' },
    { id: 'pet', name: 'Pet Supplies', icon: '🐕' },
    { id: 'asian', name: 'Asian', icon: '🍜' },
    { id: 'icecream', name: 'Ice Cream', icon: '🍦' },
    { id: 'halal', name: 'Halal', icon: '🥗' },
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
    { id: 'more', name: 'More', icon: '⋯' },
  ],
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

