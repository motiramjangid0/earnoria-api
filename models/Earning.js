const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true }, // in USDT
  source: { type: String }, // e.g., "Task", "Referral"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Earning", earningSchema);
