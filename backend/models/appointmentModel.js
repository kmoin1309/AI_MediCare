const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    doctor: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "completed", "cancelled"],
    },
    purpose: { type: String },
    location: { type: String },
    notes: { type: String },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
