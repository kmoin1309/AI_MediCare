const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createAppointment);
router.get("/", authMiddleware, getAppointments);

module.exports = router;
