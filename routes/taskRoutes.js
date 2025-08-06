const express = require("express");
const router = express.Router();
const { getTasks, completeTask } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, getTasks);
router.post("/complete", authMiddleware, completeTask);

module.exports = router;
