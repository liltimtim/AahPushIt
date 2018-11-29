module.exports = {
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/development",
  PORT: process.env.PORT || "3000",
  SECRET_KEY: process.env.SECRET_KEY || "some_secret_key"
};
