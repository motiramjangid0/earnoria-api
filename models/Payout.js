const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  walletAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payout", payoutSchema);
