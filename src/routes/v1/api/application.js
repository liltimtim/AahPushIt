const express = require("express");
const router = express.Router();
const interface = require("../../../interfaces/application");
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

router.get("/:id/config", async (req, res) => {
  try {
    let appConfig = await interface.getConfig(req, res);
    return res.json(appConfig);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
