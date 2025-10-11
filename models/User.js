const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = {
  create: async (userData) => {
    const user = new User(userData);
    await user.save();
    return user.toObject();
  },

  findById: async (id) => {
    return await User.findById(id).lean();
  },

  findByEmail: async (email) => {
    return await User.findOne({ email }).lean();
  },

  findByUsername: async (username) => {
    return await User.findOne({ username }).lean();
  },

  getAll: async () => {
    return await User.find().lean();
  },

  update: async (id, updates) => {
    return await User.findByIdAndUpdate(id, updates, { new: true }).lean();
  },

  delete: async (id) => {
    await User.findByIdAndDelete(id);
    return true;
  },
};

