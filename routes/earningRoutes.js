const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  getEarnings,
  requestPayout,
} = require("../controllers/earningController");

router.get("/", authMiddleware, getEarnings);
router.post("/payout", authMiddleware, requestPayout);

module.exports = router;
