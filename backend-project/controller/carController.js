const Car = require("../models/Car");

async function createCar(req, res) {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCars(req, res) {
  const cars = await Car.find().sort({ createdAt: -1 });
  res.json(cars);
}

module.exports = { createCar, getCars };
