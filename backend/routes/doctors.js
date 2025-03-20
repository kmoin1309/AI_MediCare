const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/specialty/:type", async (req, res) => {
  try {
    const doctors = await Doctor.find({
      specialty: { $regex: new RegExp(req.params.type, "i") },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
