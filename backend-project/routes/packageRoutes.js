const express = require("express");
const { createPackage, getPackages } = require("../controller/packageController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createPackage);
router.get("/", requireAuth, getPackages);

module.exports = router;
