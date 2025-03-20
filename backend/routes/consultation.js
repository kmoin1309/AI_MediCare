const express = require("express");
const router = express.Router();
const {
  getAllConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

router.get("/", getAllConsultations);
router.get("/:id", getConsultation);
router.post("/", createConsultation);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;
