const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const http = require("http");
const config = require("./config/keys");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(
  config.MONGODB_URI,
  { useNewUrlParser: true }
);

// Passport
app.use(passport.initialize());

// Setup Routes
const Routes = require("./routes")(app);

const server = http.createServer(app);
server.listen(config.PORT, () => {
  console.log(`Connect at ${config.PORT}`);
});
