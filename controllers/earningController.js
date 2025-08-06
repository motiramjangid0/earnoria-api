const Earning = require("../models/Earning");
const Payout = require("../models/Payout");

exports.getEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const earnings = await Earning.find({ userId });
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.json({ total, history: earnings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestPayout = async (req, res) => {
  const { amount, walletAddress } = req.body;
  try {
    const userId = req.user.id;

    const earnings = await Earning.find({ userId });
    const totalEarned = earnings.reduce((sum, e) => sum + e.amount, 0);

    const paid = await Payout.aggregate([
      { $match: { userId, status: { $ne: "Rejected" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalPaid = paid.length > 0 ? paid[0].total : 0;
    const available = totalEarned - totalPaid;

    if (amount > available) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const payout = new Payout({ userId, amount, walletAddress });
    await payout.save();

    res.json({ message: "Payout request submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
