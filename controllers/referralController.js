exports.getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const referredUsers = await User.find({ referrer: user._id });

    res.json({
      referralCode: user.referralCode,
      referralEarnings: user.referralEarnings,
      referredUsers: referredUsers.map((u) => ({
        name: u.name,
        email: u.email,
        isVerified: u.isVerified,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
