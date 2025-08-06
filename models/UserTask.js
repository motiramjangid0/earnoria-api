const mongoose = require("mongoose");

const userTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserTask", userTaskSchema);
