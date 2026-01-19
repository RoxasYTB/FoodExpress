const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/menuController');
const validate = require('../middleware/validate');
const { menuSchemas } = require('../validators/schemas');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', ctrl.listerTous);
router.get('/:id', ctrl.obtenirUn);
router.post('/', authenticate, isAdmin, validate(menuSchemas.create), ctrl.creer);
router.put('/:id', authenticate, isAdmin, validate(menuSchemas.update), ctrl.modifier);
router.delete('/:id', authenticate, isAdmin, ctrl.supprimer);

module.exports = router;

