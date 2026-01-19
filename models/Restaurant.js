const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    opening_hours: { type: String, required: true },
  },
  { timestamps: true },
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
  create: async (data) => {
    const resto = new Restaurant(data);
    await resto.save();
    return resto.toObject();
  },

  findById: async (id) => {
    return await Restaurant.findById(id).lean();
  },

  getAll: async (options = {}) => {
    const { sortBy, page = 1, limit = 10 } = options;

    let query = Restaurant.find();

    if (sortBy) {
      query = query.sort(sortBy);
    }

    const skip = (page - 1) * limit;
    const total = await Restaurant.countDocuments();
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
    return await Restaurant.findByIdAndUpdate(id, updates, { new: true }).lean();
  },

  delete: async (id) => {
    await Restaurant.findByIdAndDelete(id);
    return true;
  },
};

