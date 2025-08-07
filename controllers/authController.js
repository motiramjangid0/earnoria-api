const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Email OTP Sender Function
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password required for Gmail
    },
  });

  await transporter.sendMail({
    from: `"Earnoria" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  });
};

// Generate random referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Register
exports.register = async (req, res) => {
  let { name, email, mobile, password, referralCode } = req.body;

  // Trim input
  email = email?.trim();
  mobile = mobile?.trim();
  name = name?.trim();

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const userReferralCode = generateReferralCode();

    const newUserData = {
      name,
      email,
      mobile,
      password: hashedPassword,
      otp,
      referralCode: userReferralCode,
    };

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUserData.referrer = referrer._id;
      } else {
        return res.status(400).json({ message: "Invalid referral code." });
      }
    }

    const newUser = new User(newUserData);
    await newUser.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "User registered. OTP sent to email.",
      referralCode: userReferralCode,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

    // Remove createdAt so TTL won't delete
    user.createdAt = new Date();

    await user.save();

    res.json({ message: "Email verified successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or not verified" });
    }

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
        mobile: user.mobile,
        vipLevel: user.vipLevel,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
