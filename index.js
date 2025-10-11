require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const passport = require('./config/passport');
const { connectDB } = require('./models/database');

const utilisateurs = require('./routes/users');
const restaurants = require('./routes/restaurants');
const menus = require('./routes/menus');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(passport.initialize());

const swaggerDoc = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/users', utilisateurs);
app.use('/api/restaurants', restaurants);
app.use('/api/menus', menus);

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Erreur serveur' });
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  });
}

module.exports = app;

