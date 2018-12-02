const PushItRoutes = require("./v1/api/pushit");
const ApplicationRoutes = require("./v1/api/application");
const InstallationRoutes = require("./v1/api/installation");
module.exports = app => {
  app.use("/api/v1/aahpushit", PushItRoutes);
  app.use("/api/v1/application", ApplicationRoutes);
  app.use("/api/v1/installation", InstallationRoutes);
};
