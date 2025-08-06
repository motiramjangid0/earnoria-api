const Task = require("../models/Task");
const Vip = require("../models/Vip");
const UserTask = require("../models/UserTask");
const distributeCommission = require("../utils/commissionUtils");
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const vip = await Vip.findOne({ userId }).sort({ expiresAt: -1 });
    const vipLevel = vip ? vip.vipLevel : 0;

    const tasks = await Task.find({ vipLevel: { $lte: vipLevel } });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.body;

    const alreadyCompleted = await UserTask.findOne({
      userId,
      taskId,
      completedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    if (alreadyCompleted)
      return res.status(400).json({ message: "Task already completed today" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userTask = new UserTask({ userId, taskId });
    await userTask.save();
    await distributeCommission(userId, task.reward); // after userTask.save()

    res.json({ message: "Task completed", reward: task.reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
