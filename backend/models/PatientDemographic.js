const mongoose = require("mongoose");

const patientDemographicSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  location: { type: String, required: true },
  condition: { type: String, required: true },
  visitCount: { type: Number, default: 0 },
  lastVisit: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PatientDemographic", patientDemographicSchema);
