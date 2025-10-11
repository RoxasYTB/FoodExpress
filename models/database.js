const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodexpress');
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur connexion MongoDB:', err);
  }
};

module.exports = { connectDB };

