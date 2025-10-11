const Joi = require('joi');

const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user'),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  update: Joi.object({
    email: Joi.string().email(),
    username: Joi.string().min(3),
    password: Joi.string().min(6),
    role: Joi.string().valid('user', 'admin'),
  }).min(1),
};

const restaurantSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    opening_hours: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    opening_hours: Joi.string(),
  }).min(1),
};

const menuSchemas = {
  create: Joi.object({
    restaurant_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
  }),
  update: Joi.object({
    restaurant_id: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().positive(),
    category: Joi.string(),
  }).min(1),
};

module.exports = { userSchemas, restaurantSchemas, menuSchemas };

