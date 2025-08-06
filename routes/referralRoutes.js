const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getReferralInfo } = require("../controllers/referralController");

router.get("/", auth, getReferralInfo);

module.exports = router;
