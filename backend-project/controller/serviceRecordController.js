const Payment = require("../models/Payment");
const ServicePackage = require("../models/ServicePackage");

async function createServiceRecord(req, res) {
  try {
    const service = await ServicePackage.create(req.body);
    const populated = await service.populate("car package");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getServiceRecords(req, res) {
  const rows = await ServicePackage.find()
    .populate("car package")
    .sort({ serviceDate: -1 });
  res.json(rows);
}

async function getServiceRecordById(req, res) {
  const row = await ServicePackage.findById(req.params.id).populate("car package");
  if (!row) return res.status(404).json({ message: "Record not found" });
  return res.json(row);
}

async function updateServiceRecord(req, res) {
  try {
    const row = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("car package");
    if (!row) return res.status(404).json({ message: "Record not found" });
    return res.json(row);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function deleteServiceRecord(req, res) {
  const row = await ServicePackage.findByIdAndDelete(req.params.id);
  if (!row) return res.status(404).json({ message: "Record not found" });
  await Payment.deleteMany({ serviceRecord: row._id });
  return res.json({ message: "Record deleted" });
}

module.exports = {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord,
};
