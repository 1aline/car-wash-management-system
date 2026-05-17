const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    carNumber: { type: String, trim: true },
    plateNumber: { type: String, required: true, trim: true },
    carType: { type: String, required: true, trim: true },
    carSize: { type: String, required: true, trim: true },
    driverName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
