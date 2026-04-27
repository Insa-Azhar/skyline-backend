require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");

const authRoutes        = require("./routes/auth");
const flightRoutes      = require("./routes/flights");
const bookingRoutes     = require("./routes/bookings");
const maintenanceRoutes = require("./routes/maintenance");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests." },
});
app.use(limiter);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SKYLINE ARS Backend is running.",
    version: "1.0.0",
    author: "Muhammad Shayan, Insa Azhar, Ahmed Waseem",
    university: "Dawood University of Engineering & Technology",
    endpoints: {
      auth:        "/api/auth",
      flights:     "/api/flights",
      bookings:    "/api/bookings",
      maintenance: "/api/maintenance",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use("/api/auth",        authRoutes);
app.use("/api/flights",     flightRoutes);
app.use("/api/bookings",    bookingRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`SKYLINE ARS Backend running on port ${PORT}`);
});

module.exports = app;