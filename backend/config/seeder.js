const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const Activity = require("../models/Activity");
const PatientDemographic = require("../models/PatientDemographic");
const dotenv = require("dotenv");

dotenv.config();

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$XXX",
    role: "patient",
  },
  {
    name: "Sarah Connor",
    email: "sarah@example.com",
    password: "$2a$10$XXX",
    role: "patient",
  },
  {
    name: "Dr. Jane Smith",
    email: "jane@example.com",
    password: "$2a$10$XXX",
    role: "doctor",
  },
  {
    name: "Dr. Mike Ross",
    email: "mike@example.com",
    password: "$2a$10$XXX",
    role: "doctor",
  },
];

const doctors = [
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    availability: [
      {
        date: new Date("2024-01-20"),
        slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      },
    ],
  },
  {
    name: "Dr. Mike Ross",
    specialty: "Neurologist",
    availability: [
      {
        date: new Date("2024-01-21"),
        slots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      },
    ],
  },
];

const appointments = [
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2024-01-20"),
    time: "10:00",
    status: "pending", // Changed from "scheduled" to "pending"
    type: "regular",
    purpose: "Follow-up on knee abrasion",
    location: "https://meet.google.com/abc-defg-hij",
    consultationId: new mongoose.Types.ObjectId(),
    notes: "Bring recent photos",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2024-01-21"),
    time: "14:00",
    status: "completed",
    type: "follow-up",
    purpose: "Annual check-up",
    location: "Clinic A",
    consultationId: new mongoose.Types.ObjectId(),
    notes: "Blood test results reviewed",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2024-02-20"),
    time: "09:30",
    status: "completed",
    type: "regular",
    purpose: "Skin rash consultation",
    location: "Clinic B",
    consultationId: new mongoose.Types.ObjectId(),
    notes: "",
  },
];

const medicalRecords = [
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-03-01"),
    type: "consultation",
    description: "Annual checkup",
    doctor: "Dr. Smith",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-03-10"),
    type: "test",
    description: "Blood work results",
    doctor: "Dr. Johnson",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-03-15"),
    type: "prescription",
    description: "Antibiotics for infection",
    doctor: "Dr. Smith",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-02-20"),
    type: "consultation",
    description: "Follow-up on blood pressure",
    doctor: "Dr. Johnson",
  },
];

const diagnosticRecords = [
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-03-10"),
    type: "test", // Changed from diagnostic to test
    description: "Blood pressure monitoring", // Added required field
    diagnosis: "Hypertension",
    testResults: "Blood pressure: 140/90 mmHg",
    severity: "medium",
    doctor: "Dr. Johnson",
    notes: "Monitor for 2 weeks",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-03-01"),
    type: "consultation", // Changed from diagnostic to consultation
    description: "Upper respiratory infection evaluation", // Added required field
    diagnosis: "Upper Respiratory Infection",
    testResults: "Positive for bacterial infection",
    severity: "low",
    doctor: "Dr. Smith",
    notes: "Prescribed antibiotics",
  },
  {
    id: new mongoose.Types.ObjectId(),
    date: new Date("2025-02-20"),
    type: "test", // Changed from diagnostic to test
    description: "Diabetes screening test", // Added required field
    diagnosis: "Pre-diabetes",
    testResults: "A1C: 6.2%",
    severity: "medium",
    doctor: "Dr. Johnson",
    notes: "Dietary changes recommended",
  },
];

const activities = [
  {
    action: "Appointment Scheduled",
    timestamp: new Date("2024-01-15"),
  },
  {
    action: "Medical Record Updated",
    timestamp: new Date("2024-01-10"),
  },
];

const demographics = [
  {
    age: 35,
    gender: "male",
    location: "New York",
    condition: "hypertension",
  },
  {
    age: 42,
    gender: "female",
    location: "Los Angeles",
    condition: "diabetes",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear all collections
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Activity.deleteMany();
    await PatientDemographic.deleteMany();

    // Create users
    const createdUsers = await User.insertMany(users);
    const patients = createdUsers.filter((user) => user.role === "patient");
    const doctorUsers = createdUsers.filter((user) => user.role === "doctor");

    // Create doctors with reference to user accounts
    const doctorsWithUsers = doctors.map((doc, index) => ({
      ...doc,
      userId: doctorUsers[index]._id,
    }));
    const createdDoctors = await Doctor.insertMany(doctorsWithUsers);

    // Create appointments with references - using modulo to cycle through available users
    const appointmentsWithRefs = appointments.map((apt, index) => ({
      ...apt,
      patientId: patients[index % patients.length]._id,
      doctorId: createdDoctors[index % createdDoctors.length]._id,
    }));
    await Appointment.insertMany(appointmentsWithRefs);

    // Create medical records with references
    const medicalRecordsWithRefs = medicalRecords.map((record, index) => ({
      ...record,
      userId: patients[index % patients.length]._id,
    }));
    await MedicalRecord.insertMany(medicalRecordsWithRefs);

    // Create diagnostic records with references
    const diagnosticRecordsWithRefs = diagnosticRecords.map(
      (record, index) => ({
        ...record,
        userId: patients[index % patients.length]._id,
      })
    );
    await MedicalRecord.insertMany(diagnosticRecordsWithRefs);

    // Create activities with references
    const activitiesWithRefs = activities.map((activity, index) => ({
      ...activity,
      userId: patients[index % patients.length]._id,
    }));
    await Activity.insertMany(activitiesWithRefs);

    // Create demographics with references
    const demographicsWithRefs = demographics.map((demo, index) => ({
      ...demo,
      userId: patients[index % patients.length]._id,
    }));
    await PatientDemographic.insertMany(demographicsWithRefs);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Activity.deleteMany();
    await PatientDemographic.deleteMany();

    console.log("Data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
