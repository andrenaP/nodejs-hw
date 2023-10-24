const { HttpError } = require("../helpers");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");
jwt = require("jsonwebtoken");
const SecretKey = `${process.env.SecretKey}`;
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
var Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

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
  const { email, subscription } = req.user;

  res.json({
    email: email,
    subscription: subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({});
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) throw HttpError(401, "avatar is invalid");
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  Jimp.read(tempUpload, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).write(resultUpload);
  });

  fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", filename);
  console.log(avatarURL);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
