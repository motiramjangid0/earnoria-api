const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getEarnings,
  requestPayout,
} = require("../controllers/earningController");

router.get("/", auth, getEarnings);
router.post("/payout", auth, requestPayout);

module.exports = router;
