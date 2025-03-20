const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/videoCallController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/messages/:consultationId", authMiddleware, getMessages);

module.exports = router;
