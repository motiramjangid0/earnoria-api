const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  vipLevel: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  reward: { type: Number, required: true }, // reward in USDT
});

module.exports = mongoose.model("Task", taskSchema);
