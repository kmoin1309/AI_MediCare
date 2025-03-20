const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/patient", require("./routes/patient"));
app.use("/api/doctor", require("./routes/doctor"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/emergency", require("./routes/emergency"));
app.use("/api/whatsapp", require("./routes/whatsapp"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
