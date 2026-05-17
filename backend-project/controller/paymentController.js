const Payment = require("../models/Payment");
const ServicePackage = require("../models/ServicePackage");
const generateSequence = require("../utils/generateSequence");

async function createPayment(req, res) {
  try {
    req.body.user = req.session.user.id;
    req.body.paymentNumber = await generateSequence("payment", "PAY");
    const payment = await Payment.create(req.body);
    const populated = await payment.populate({
      path: "serviceRecord",
      populate: ["car", "package"],
    });
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getPayments(req, res) {
  const rows = await Payment.find({ user: req.session.user.id })
    .populate({ path: "serviceRecord", populate: ["car", "package"] })
    .sort({ paymentDate: -1 });
  res.json(rows);
}

async function generateBill(req, res) {
  const serviceRecord = await ServicePackage.findOne({ _id: req.params.recordId, user: req.session.user.id }).populate(
    "car package"
  );
  if (!serviceRecord) {
    return res.status(404).json({ message: "Service record not found" });
  }
  const payment = await Payment.findOne({ serviceRecord: serviceRecord._id, user: req.session.user.id }).sort({
    paymentDate: -1,
  });
  return res.json({
    plateNumber: serviceRecord.car.plateNumber,
    driverName: serviceRecord.car.driverName,
    phoneNumber: serviceRecord.car.phoneNumber,
    packageName: serviceRecord.package.packageName,
    packageDescription: serviceRecord.package.packageDescription,
    packagePrice: serviceRecord.package.packagePrice,
    amountPaid: payment ? payment.amountPaid : 0,
    balance: serviceRecord.package.packagePrice - (payment ? payment.amountPaid : 0),
    paymentDate: payment ? payment.paymentDate : null,
    serviceDate: serviceRecord.serviceDate,
    recordNumber: serviceRecord.recordNumber,
  });
}

async function getDailyReport(req, res) {
  const targetDate = req.query.date ? new Date(req.query.date) : new Date();
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  const rows = await Payment.find({
    user: req.session.user.id,
    paymentDate: { $gte: dayStart, $lte: dayEnd },
  })
    .populate({ path: "serviceRecord", populate: ["car", "package"] })
    .sort({ paymentDate: -1 });

  const report = rows.map((row) => ({
    plateNumber: row.serviceRecord?.car?.plateNumber || "",
    packageName: row.serviceRecord?.package?.packageName || "",
    packageDescription: row.serviceRecord?.package?.packageDescription || "",
    amountPaid: row.amountPaid,
    paymentDate: row.paymentDate,
  }));

  return res.json(report);
}

module.exports = { createPayment, getPayments, generateBill, getDailyReport };
