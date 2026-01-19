const Restaurant = require('../models/Restaurant');

exports.creer = async (req, res) => {
  const resto = await Restaurant.create(req.validatedBody);
  res.status(201).json(resto);
};

exports.listerTous = async (req, res) => {
  const { sortBy, page, limit } = req.query;
  const result = await Restaurant.getAll({
    sortBy,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });

  const dataWithId = result.data.map((resto) => ({
    _id: resto._id,
    id: resto._id,
    name: resto.name,
    address: resto.address,
    phone: resto.phone,
    opening_hours: resto.opening_hours,
  }));

  res.json(dataWithId);
};

exports.obtenirUn = async (req, res) => {
  const resto = await Restaurant.findById(req.params.id);
  if (!resto) return res.status(404).json({ message: 'Restaurant non trouvé' });

  res.json({
    _id: resto._id,
    id: resto._id,
    name: resto.name,
    address: resto.address,
    phone: resto.phone,
    opening_hours: resto.opening_hours,
  });
};

exports.modifier = async (req, res) => {
  const restoId = req.params.id;
  if (!(await Restaurant.findById(restoId))) {
    return res.status(404).json({ message: 'Restaurant non trouvé' });
  }
  const updated = await Restaurant.update(restoId, req.validatedBody);
  res.json(updated);
};

exports.supprimer = async (req, res) => {
  const restoId = req.params.id;
  if (!(await Restaurant.findById(restoId))) {
    return res.status(404).json({ message: 'Restaurant non trouvé' });
  }
  await Restaurant.delete(restoId);
  res.json({ message: 'Restaurant supprimé' });
};

