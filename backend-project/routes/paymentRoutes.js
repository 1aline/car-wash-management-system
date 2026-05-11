const express = require("express");
const {
  createPayment,
  getPayments,
  generateBill,
  getDailyReport,
} = require("../controller/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/payments", requireAuth, createPayment);
router.get("/payments", requireAuth, getPayments);
router.get("/bills/:recordId", requireAuth, generateBill);
router.get("/reports/daily", requireAuth, getDailyReport);

module.exports = router;
