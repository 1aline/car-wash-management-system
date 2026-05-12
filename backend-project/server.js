const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const sessionConfig = require("./config/session");
const { health } = require("./controller/healthController");
const { seedDefaultPackages } = require("./controller/packageController");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const packageRoutes = require("./routes/packageRoutes");
const serviceRecordRoutes = require("./routes/serviceRecordRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Allow the frontend dev servers to call the backend (CORS)
// Your frontend is commonly served by Vite on different ports (5173/5174).
// We allow both in dev to prevent CORS origin mismatch errors.
const CLIENT_URLS = (process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser requests (no Origin header)
      if (!origin) return cb(null, true);
      if (CLIENT_URLS.includes(origin)) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(sessionConfig());

app.get("/api/health", health);
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/service-records", serviceRecordRoutes);
app.use("/api", paymentRoutes);

connectDB()
  .then(async () => {
    await seedDefaultPackages();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
