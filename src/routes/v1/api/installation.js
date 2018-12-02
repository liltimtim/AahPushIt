const router = require("express").Router();
const interface = require("../../../interfaces/installation");
router.get("/");

const throwError = (err, res) => {
  if (err.message) {
    return res.status(500).json({
      error: err.message
    });
  } else {
    return res.status(500).json({
      error: err
    });
  }
};

module.exports = router;
