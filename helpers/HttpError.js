var createError = require("http-errors");
const HttpError = (status, message) => {
  return createError(status, message);
};

module.exports = HttpError;
