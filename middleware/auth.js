const passport = require('passport');

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin requis' });
  }
  next();
};

const isOwnerOrAdmin = (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.user._id ? req.user._id.toString() : req.user.id;
  if (req.user.role === 'admin' || currentUserId === userId) {
    return next();
  }
  res.status(403).json({ message: 'Accès refusé' });
};

module.exports = { authenticate, isAdmin, isOwnerOrAdmin };


