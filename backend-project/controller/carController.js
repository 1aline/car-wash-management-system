const Car = require("../models/Car");
const generateSequence = require("../utils/generateSequence");

async function createCar(req, res) {
  try {
    req.body.user = req.session.user.id;
    req.body.carNumber = await generateSequence("car", "CAR");
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCars(req, res) {
  const cars = await Car.find({ user: req.session.user.id }).sort({ createdAt: -1 });
  res.json(cars);
}

module.exports = { createCar, getCars };
