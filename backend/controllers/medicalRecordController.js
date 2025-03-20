const MedicalRecord = require("../models/MedicalRecord");

exports.getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(records);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addMedicalRecord = async (req, res) => {
  try {
    const newRecord = new MedicalRecord({
      userId: req.user.id,
      ...req.body,
    });
    const record = await newRecord.save();
    res.json(record);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
