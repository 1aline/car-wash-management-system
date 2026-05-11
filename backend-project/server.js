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
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
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
