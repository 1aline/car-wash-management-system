const express = require("express");
const { createCar, getCars } = require("../controller/carController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createCar);
router.get("/", requireAuth, getCars);

module.exports = router;
