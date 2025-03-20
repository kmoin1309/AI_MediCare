const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["consultation", "test", "prescription"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    diagnosis: String,
    testResults: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
