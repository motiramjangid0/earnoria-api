const Vip = require("../models/Vip");
const distributeCommission = require("../utils/commissionUtils");
exports.purchaseVip = async (req, res) => {
  try {
    const { vipLevel, txHash, walletAddress } = req.body;
    const userId = req.user.id;

    const durationDays = 30;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const newVip = new Vip({
      userId,
      vipLevel,
      txHash,
      walletAddress,
      expiresAt,
    });

    await newVip.save();
    await distributeCommission(userId, price); // price is the VIP level amount

    res.status(201).json({ message: "VIP Purchased", expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVipStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const vip = await Vip.findOne({ userId }).sort({ expiresAt: -1 });

    if (!vip) return res.json({ vipLevel: 0 });

    res.json({ vipLevel: vip.vipLevel, expiresAt: vip.expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
