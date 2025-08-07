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
  referralCode: { type: String, unique: true },
  referralEarnings: { type: Number, default: 0 },
  mobile: String,

  // ✅ TTL field
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // expires after 600 seconds = 10 minutes
  },
});
module.exports = mongoose.model("User", userSchema);
