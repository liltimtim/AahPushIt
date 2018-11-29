const PushItRoutes = require("./v1/api/pushit");
const ApplicationRoutes = require("./v1/api/application");
module.exports = app => {
  app.use("/api/v1/aahpushit", PushItRoutes);
  app.use("/api/v1/application", ApplicationRoutes);
};
