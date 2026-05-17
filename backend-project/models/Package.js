const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageNumber: { type: String, required: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    packageDescription: { type: String, required: true, trim: true },
    packagePrice: { type: Number, required: true, min: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
