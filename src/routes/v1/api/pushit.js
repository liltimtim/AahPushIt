const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req);
  return res.json({ hello: "world" });
});

module.exports = router;
