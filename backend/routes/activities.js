const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        type: "appointment",
        description: "Upcoming appointment with Dr. Smith",
        date: new Date().toISOString(),
        status: "pending",
      },
    ];

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities" });
  }
});

module.exports = router;
