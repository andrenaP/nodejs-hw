const nameRegExp = "^[A-Za-zА-Яа-я]+( [A-Za-zА-Яа-я]+)?$";
const phoneRegExp = "^[0-9-+]{9,15}$";
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().pattern(RegExp(nameRegExp)).required(),
  email: Joi.string().required(),
  phone: Joi.string().pattern(RegExp(phoneRegExp)).required(),
  favorite: Joi.bool(),
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

module.exports = {
  schemas,
};
