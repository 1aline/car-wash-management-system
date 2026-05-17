const Package = require("../models/Package");
const generateSequence = require("../utils/generateSequence");

async function createPackage(req, res) {
  try {
    req.body.user = req.session.user.id;
    req.body.packageNumber = await generateSequence("package", "PKG");
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getPackages(req, res) {
  const packages = await Package.find({
    $or: [{ user: req.session.user.id }, { user: { $exists: false } }, { user: null }],
  }).sort({ createdAt: -1 });
  res.json(packages);
}

async function seedDefaultPackages() {
  const defaults = [
    {
      packageNumber: "PKG-001",
      packageName: "Basic wash",
      packageDescription: "Exterior hand wash",
      packagePrice: 5000,
    },
    {
      packageNumber: "PKG-002",
      packageName: "Classic wash",
      packageDescription: "Interior hand wash",
      packagePrice: 10000,
    },
    {
      packageNumber: "PKG-003",
      packageName: "Premium wash",
      packageDescription: "Exterior and Interior hand wash",
      packagePrice: 20000,
    },
  ];

  for (const item of defaults) {
    await Package.updateOne(
      { packageNumber: item.packageNumber },
      { $setOnInsert: item },
      { upsert: true }
    );
  }
}

module.exports = { createPackage, getPackages, seedDefaultPackages };
