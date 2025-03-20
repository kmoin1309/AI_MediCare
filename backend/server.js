const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 204,
  })
);

// Handle preflight OPTIONS requests
app.options("*", cors());

app.use(express.json());

// Routes - Load only implemented routes
try {
  const authRouter = require("./routes/auth");
  const consultationRouter = require("./routes/consultation");
  const appointmentRouter = require("./routes/appointment");
  const activitiesRouter = require("./routes/activities");
  const notificationsRouter = require("./routes/notifications");

  if (typeof authRouter === "function") app.use("/api/auth", authRouter);
  if (typeof consultationRouter === "function")
    app.use("/api/consultation", consultationRouter);
  if (typeof appointmentRouter === "function")
    app.use("/api/appointment", appointmentRouter);
  if (typeof activitiesRouter === "function")
    app.use("/api/activities", activitiesRouter);
  if (typeof notificationsRouter === "function")
    app.use("/api/notifications", notificationsRouter);
} catch (error) {
  console.error("Error loading routes:", error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
