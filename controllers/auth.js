const { HttpError } = require("../helpers");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");
jwt = require("jsonwebtoken");
const SecretKey = `${process.env.SecretKey}`;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SecretKey, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(201).json({
    token: token,
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
