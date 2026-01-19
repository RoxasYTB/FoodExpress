const Menu = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

exports.creer = async (req, res) => {
  const menuData = req.validatedBody;

  if (!(await Restaurant.findById(menuData.restaurant_id))) {
    return res.status(404).json({ message: 'Restaurant non trouvé' });
  }

  const menu = await Menu.create(menuData);
  res.status(201).json(menu);
};

exports.listerTous = async (req, res) => {
  const { sortBy, page, limit, restaurant_id } = req.query;
  const result = await Menu.getAll({
    sortBy,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    restaurant_id,
  });

  const dataWithId = result.data.map((menu) => ({
    _id: menu._id,
    id: menu._id,
    restaurant_id: menu.restaurant_id,
    name: menu.name,
    description: menu.description,
    price: menu.price,
    category: menu.category,
  }));

  res.json(dataWithId);
};

exports.obtenirUn = async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) return res.status(404).json({ message: 'Menu non trouvé' });

  res.json({
    _id: menu._id,
    id: menu._id,
    restaurant_id: menu.restaurant_id,
    name: menu.name,
    description: menu.description,
    price: menu.price,
    category: menu.category,
  });
};

exports.modifier = async (req, res) => {
  const menuId = req.params.id;
  const updates = req.validatedBody;

  if (!(await Menu.findById(menuId))) {
    return res.status(404).json({ message: 'Menu non trouvé' });
  }

  if (updates.restaurant_id && !(await Restaurant.findById(updates.restaurant_id))) {
    return res.status(404).json({ message: 'Restaurant non trouvé' });
  }

  const updated = await Menu.update(menuId, updates);
  res.json(updated);
};

exports.supprimer = async (req, res) => {
  const menuId = req.params.id;
  if (!(await Menu.findById(menuId))) {
    return res.status(404).json({ message: 'Menu non trouvé' });
  }
  await Menu.delete(menuId);
  res.json({ message: 'Menu supprimé' });
};

