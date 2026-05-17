const Counter = require("../models/Counter");

/**
 * Generates the next sequential number for a given entity.
 * e.g. generateSequence("car", "CAR") => "CAR-0001"
 */
async function generateSequence(entityKey, prefix) {
  const counter = await Counter.findByIdAndUpdate(
    entityKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const paddedNumber = String(counter.seq).padStart(4, "0");
  return `${prefix}-${paddedNumber}`;
}

module.exports = generateSequence;
