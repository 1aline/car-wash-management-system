const express = require("express");
const {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord,
} = require("../controller/serviceRecordController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", requireAuth, createServiceRecord);
router.get("/", requireAuth, getServiceRecords);
router.get("/:id", requireAuth, getServiceRecordById);
router.put("/:id", requireAuth, updateServiceRecord);
router.delete("/:id", requireAuth, deleteServiceRecord);

module.exports = router;
