const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  const { patientId, doctorId, date } = req.body;
  const consultationId = `consultation-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const appointment = new Appointment({
    patientId,
    doctorId,
    date,
    consultationId,
  });
  await appointment.save();
  res.status(201).json(appointment);
};

exports.getAppointments = async (req, res) => {
  const { userId } = req.user;
  const appointments = await Appointment.find({
    $or: [{ patientId: userId }, { doctorId: userId }],
  }).populate("patientId doctorId", "name email");
  res.json(appointments);
};
