const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  isVerified: { type: Boolean, default: false },
  vipLevel: { type: Number, default: 0 },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  referralCode: { type: String, unique: true }, // auto-generated code
  referralEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
