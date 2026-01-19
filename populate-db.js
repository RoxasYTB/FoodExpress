const mongoose = require('mongoose');
require('dotenv').config();

const RestaurantModel = mongoose.model(
  'Restaurant',
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      opening_hours: { type: String, required: true },
    },
    { timestamps: true },
  ),
);

const MenuModel = mongoose.model(
  'Menu',
  new mongoose.Schema(
    {
      restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
    },
    { timestamps: true },
  ),
);

const sampleRestaurants = [
  {
    name: 'Pizza Paradise',
    address: '10 rue de la Pizza, 75001 Paris',
    phone: '0123456789',
    opening_hours: '11h-23h',
  },
  {
    name: 'Burger House',
    address: '25 avenue des Burgers, 75002 Paris',
    phone: '0123456790',
    opening_hours: '12h-22h',
  },
  {
    name: 'Sushi Master',
    address: '5 rue du Japon, 75003 Paris',
    phone: '0123456791',
    opening_hours: '12h-23h',
  },
  {
    name: 'Le Bistrot Français',
    address: '15 rue de la Gastronomie, 75004 Paris',
    phone: '0123456792',
    opening_hours: '12h-15h, 19h-23h',
  },
];

const sampleMenus = {
  'Pizza Paradise': [
    { name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic', price: 12.5, category: 'plat' },
    { name: 'Pizza 4 Fromages', description: 'Mozzarella, gorgonzola, chèvre, parmesan', price: 14.5, category: 'plat' },
    { name: 'Pizza Reine', description: 'Tomate, mozzarella, jambon, champignons', price: 13.5, category: 'plat' },
    { name: 'Tiramisu', description: 'Mascarpone, café, cacao', price: 6.5, category: 'dessert' },
    { name: 'Panna Cotta', description: 'Crème, vanille, coulis de fruits rouges', price: 5.5, category: 'dessert' },
    { name: 'Coca-Cola', description: '33cl', price: 3.0, category: 'boisson' },
    { name: 'Eau minérale', description: '50cl', price: 2.5, category: 'boisson' },
  ],
  'Burger House': [
    { name: 'Classic Burger', description: 'Steak haché, salade, tomate, oignon', price: 11.0, category: 'plat' },
    { name: 'Cheese Burger', description: 'Steak haché, cheddar, salade, tomate', price: 12.0, category: 'plat' },
    { name: 'Bacon Burger', description: 'Steak haché, bacon, cheddar, sauce BBQ', price: 13.5, category: 'plat' },
    { name: 'Frites', description: 'Pommes de terre frites maison', price: 4.0, category: 'entrée' },
    { name: 'Onion Rings', description: "Rondelles d'oignon panées", price: 4.5, category: 'entrée' },
    { name: 'Milkshake Vanille', description: 'Glace vanille, lait', price: 5.0, category: 'boisson' },
    { name: 'Brownie', description: 'Chocolat, noix de pécan', price: 5.5, category: 'dessert' },
  ],
  'Sushi Master': [
    { name: 'California Roll', description: '8 pièces - Surimi, avocat, concombre', price: 8.5, category: 'plat' },
    { name: 'Saumon Roll', description: '8 pièces - Saumon, avocat', price: 9.5, category: 'plat' },
    { name: 'Thon Roll', description: '8 pièces - Thon, concombre', price: 10.0, category: 'plat' },
    { name: 'Miso Soup', description: 'Soupe japonaise traditionnelle', price: 3.5, category: 'entrée' },
    { name: 'Edamame', description: 'Fèves de soja grillées', price: 4.0, category: 'entrée' },
    { name: 'Thé Vert', description: 'Thé vert japonais', price: 3.0, category: 'boisson' },
    { name: 'Mochi', description: 'Glace enrobée de pâte de riz - 3 pièces', price: 6.0, category: 'dessert' },
  ],
  'Le Bistrot Français': [
    { name: 'Boeuf Bourguignon', description: 'Boeuf mijoté au vin rouge, légumes', price: 18.5, category: 'plat' },
    { name: 'Coq au Vin', description: 'Poulet mijoté au vin, lardons, champignons', price: 17.0, category: 'plat' },
    { name: 'Magret de Canard', description: 'Sauce miel et épices', price: 19.5, category: 'plat' },
    { name: 'Foie Gras', description: 'Foie gras de canard, pain toasté', price: 12.0, category: 'entrée' },
    { name: 'Escargots', description: '6 escargots au beurre persillé', price: 9.5, category: 'entrée' },
    { name: 'Crème Brûlée', description: 'Crème vanille caramélisée', price: 7.0, category: 'dessert' },
    { name: 'Vin Rouge', description: 'Verre de vin de Bordeaux', price: 6.0, category: 'boisson' },
  ],
};

async function populateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodexpress');
    console.log('✓ Connecté à MongoDB');

    await RestaurantModel.deleteMany({});
    await MenuModel.deleteMany({});
    console.log('✓ Base de données nettoyée');

    for (const restaurantData of sampleRestaurants) {
      const restaurant = new RestaurantModel(restaurantData);
      await restaurant.save();
      console.log(`✓ Restaurant créé : ${restaurant.name}`);

      const menus = sampleMenus[restaurant.name];
      if (menus) {
        for (const menuData of menus) {
          const menu = new MenuModel({
            ...menuData,
            restaurant_id: restaurant._id,
          });
          await menu.save();
        }
        console.log(`  → ${menus.length} menus ajoutés`);
      }
    }

    console.log('\n🎉 Base de données peuplée avec succès !');
    console.log('\nRésumé :');
    const restaurantCount = await RestaurantModel.countDocuments();
    const menuCount = await MenuModel.countDocuments();
    console.log(`- ${restaurantCount} restaurants`);
    console.log(`- ${menuCount} menus`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
}

populateDatabase();

