const mongoose = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../middlewares/handleMongooseError");
const Schema = mongoose.Schema;

const nameRegExp = "^[A-Za-zА-Яа-я]+( [A-Za-zА-Яа-я]+)?$";
const phoneRegExp = "^[0-9-+]{9,15}$";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

ContactSchema.post("save", handleMongooseError);

const Contact = mongoose.model("contact", ContactSchema);

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
  Contact,
};
