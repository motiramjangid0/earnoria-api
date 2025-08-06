// utils/commissionUtils.js

const User = require("../models/User");

const distributeCommission = async (userId, baseAmount) => {
  const percentages = [0.1, 0.2, 0.3]; // Level 1, 2, 3
  let currentUser = await User.findById(userId);
  let level = 0;

  while (currentUser?.referrer && level < 3) {
    const referrer = await User.findById(currentUser.referrer);
    if (!referrer) break;

    const commission = baseAmount * percentages[level];
    referrer.earnings += commission;
    await referrer.save();

    console.log(
      `Level ${level + 1} referrer ${referrer.email} earned ${commission}`
    );

    currentUser = referrer;
    level++;
  }
};

module.exports = distributeCommission;
