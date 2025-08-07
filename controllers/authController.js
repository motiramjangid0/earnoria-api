const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Email OTP Sender Function
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "smtp.ethereal.email" for testing
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // use app password, not Gmail password
    },
  });

  await transporter.sendMail({
    from: `"Earnoria" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    html: `<p>Your OTP is: <b>${otp}</b></p>`,
  });
};

exports.register = async (req, res) => {
  const { name, email, password, referralCode } = req.body; // added referralCode
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUserData = {
      name,
      email,
      password: hashedPassword,
      otp,
    };

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUserData.referredBy = referralCode;

        // Optional: Add referral reward here
        // referrer.earnings += 5; // or any logic
        // await referrer.save();
      } else {
        return res.status(400).json({ message: "Invalid referral code." });
      }
    }

    const newUser = new User(newUserData);
    await newUser.save();

    await sendOTPEmail(email, otp);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP
// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;

    // Remove createdAt so MongoDB TTL doesn't delete
    user.createdAt = undefined;

    await user.save();

    res.json({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res
        .status(401)
        .json({ message: "Invalid credentials or not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        vipLevel: user.vipLevel,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
