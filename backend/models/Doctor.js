const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  availability: [
    {
      date: Date,
      slots: [String],
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
