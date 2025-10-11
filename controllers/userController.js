const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const creerToken = (user) => {
  const userId = user._id || user.id;
  return jwt.sign({ id: userId.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.inscription = async (req, res) => {
  const { email, username, password, role } = req.validatedBody;

  if (await User.findByEmail(email)) {
    return res.status(400).json({ message: "L'email existe déjà" });
  }

  const mdpHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    password: mdpHash,
    role: role || 'user',
  });

  const token = creerToken(user);
  const { password: _, ...userData } = user;

  res.status(201).json({ user: userData, token });
};

exports.connexion = async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await User.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Identifiants incorrects' });
  }

  const token = creerToken(user);
  const { password: _, ...userData } = user;
  res.json({ user: userData, token });
};

exports.listerTous = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  const users = await User.getAll();
  const usersData = users.map(({ password, _id, ...u }) => ({
    id: _id,
    ...u,
  }));
  res.json(usersData);
};

exports.obtenirUn = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  const { password, _id, ...userData } = user;
  res.json({ id: _id, ...userData });
};

exports.modifier = async (req, res) => {
  const userId = req.params.id;
  const updates = req.validatedBody;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  if (updates.role && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Seuls les admins peuvent changer les rôles' });
  }

  const updated = await User.update(userId, updates);
  const { password, ...userData } = updated;
  res.json(userData);
};

exports.supprimer = async (req, res) => {
  const userId = req.params.id;
  if (!(await User.findById(userId))) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  await User.delete(userId);
  res.json({ message: 'Utilisateur supprimé' });
};

