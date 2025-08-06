const mongoose = require("mongoose");

const vipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vipLevel: { type: Number, required: true },
  txHash: { type: String, required: true },
  walletAddress: { type: String, required: true },
  purchasedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Vip", vipSchema);
