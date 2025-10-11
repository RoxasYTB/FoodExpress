const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = {
  create: async (data) => {
    const menu = new Menu(data);
    await menu.save();
    return menu.toObject();
  },

  findById: async (id) => {
    return await Menu.findById(id).lean();
  },

  findByRestaurantId: async (restaurantId) => {
    return await Menu.find({ restaurant_id: restaurantId }).lean();
  },

  getAll: async (options = {}) => {
    const { sortBy, page = 1, limit = 10, restaurant_id } = options;

    let filter = {};
    if (restaurant_id) {
      filter.restaurant_id = restaurant_id;
    }

    let query = Menu.find(filter);

    if (sortBy === 'price') {
      query = query.sort({ price: 1 });
    } else if (sortBy === 'category') {
      query = query.sort({ category: 1 });
    }

    const skip = (page - 1) * limit;
    const total = await Menu.countDocuments(filter);
    const data = await query.skip(skip).limit(limit).lean();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  update: async (id, updates) => {
    return await Menu.findByIdAndUpdate(id, updates, { new: true }).lean();
  },

  delete: async (id) => {
    await Menu.findByIdAndDelete(id);
    return true;
  },
};

