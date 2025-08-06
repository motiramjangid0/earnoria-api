const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const vipRoutes = require("./routes/vipRoutes");
const taskRoutes = require("./routes/taskRoutes");
const earningRoutes = require("./routes/earningRoutes");
const referralRoutes = require("./routes/referralRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Earnoria API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/vip", vipRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/referral", referralRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
