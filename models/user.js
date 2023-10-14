const mongoose = require("mongoose");
const handleMongooseError = require("../middlewares/handleMongooseError");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.post("save", handleMongooseError);

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
