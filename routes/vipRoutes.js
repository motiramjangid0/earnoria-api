const express = require("express");
const router = express.Router();
const { purchaseVip, getVipStatus } = require("../controllers/vipController");
const authMiddleware = require("../middlewares/auth");
// to verify JWT

router.post("/purchase", authMiddleware, purchaseVip);
router.get("/status", authMiddleware, getVipStatus);

module.exports = router;
