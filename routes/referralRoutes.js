const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { getReferralInfo } = require("../controllers/referralController");

router.get("/", authMiddleware, getReferralInfo);

module.exports = router;
