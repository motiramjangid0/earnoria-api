const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
  vipLevel: { type: Number, default: 0 },
  mobile: { type: String },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  referralCode: { type: String, unique: true },
  referralEarnings: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 }, // 💰 NEW
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
