const express = require("express");
const router = express.Router();
const PatientDemographic = require("../models/PatientDemographic");

router.get("/", async (req, res) => {
  try {
    const { timeRange, ageRange, gender, location, condition } = req.query;

    let query = {};

    if (timeRange && timeRange !== "all") {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(timeRange));
      query.createdAt = { $gte: date };
    }

    if (ageRange) {
      const [min, max] = ageRange.split(",");
      query.age = { $gte: parseInt(min), $lte: parseInt(max) };
    }

    if (gender && gender.length) query.gender = { $in: gender.split(",") };
    if (location && location.length)
      query.location = { $in: location.split(",") };
    if (condition && condition.length)
      query.condition = { $in: condition.split(",") };

    const demographics = await PatientDemographic.find(query);
    res.json(demographics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
