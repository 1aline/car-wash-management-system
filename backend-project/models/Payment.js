const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true, trim: true },
    amountPaid: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, required: true },
    serviceRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
