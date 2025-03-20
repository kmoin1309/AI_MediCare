const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getMedicalRecords,
  addMedicalRecord,
} = require("../controllers/medicalRecordController");

router.get("/", auth, getMedicalRecords);
router.post("/", auth, addMedicalRecord);

module.exports = router;
