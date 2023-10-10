const handleMongooseError = (error, data, next) => {
  console.log("hi");
  error.status = 400;
  next();
};

module.exports = handleMongooseError;
