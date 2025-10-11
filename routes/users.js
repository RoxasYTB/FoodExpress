const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const validate = require('../middleware/validate');
const { userSchemas } = require('../validators/schemas');
const { authenticate, isOwnerOrAdmin, isAdmin } = require('../middleware/auth');

router.post('/register', validate(userSchemas.register), ctrl.inscription);
router.post('/login', validate(userSchemas.login), ctrl.connexion);
router.get('/', authenticate, ctrl.listerTous);
router.get('/:id', authenticate, isOwnerOrAdmin, ctrl.obtenirUn);
router.put('/:id', authenticate, isOwnerOrAdmin, validate(userSchemas.update), ctrl.modifier);
router.delete('/:id', authenticate, isOwnerOrAdmin, ctrl.supprimer);

module.exports = router;

