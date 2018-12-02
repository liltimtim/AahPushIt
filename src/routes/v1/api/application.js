const express = require("express");
const router = express.Router();
const passport = require("passport");
const interface = require("../../../interfaces/application");
const IInstallation = require("../../../interfaces/installation");
const multer = require("multer");

router.get("/", async (req, res) => {
  return res.json(await interface.get());
});

router.post("/", async (req, res) => {
  try {
    return res.json(await interface.post(req.body));
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
/**
 * Allow device to be registered to a particular application.
 * This will create an installation for the caller for the particular
 * application.
 */
router.post("/:id/register", async (req, res) => {
  try {
    return res.json(await interface.register(req));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:id/authenticate", async (req, res) => {
  try {
    return res.json(await interface.authenticate(req));
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

/**
 * Configuration is any file that is used to configure the push notification service.
 * This could be firebase or some other provider.
 */
router.post("/:id/config", multer().single("config"), async (req, res) => {
  try {
    return res.json(await interface.putConfig(req));
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get(
  "/:id/config",

  async (req, res) => {
    try {
      let appConfig = await interface.getConfig(req, res);
      if (!appConfig) {
        return res.status(404).json({
          error: `Application with id ${
            req.params.id
          } does not have a configuration`
        });
      }
      return res.json(appConfig);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

router.get(
  "/:id/testprotected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    return res.json({ installation: req.user });
  }
);

router.get(
  "/:id/installations",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      return res.json(await interface.getDevices(req));
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);
module.exports = router;
