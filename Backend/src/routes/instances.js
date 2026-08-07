const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authtoken");
const checkRole = require("../middleware/checkRole");
const { createInstance, getInstances, getInstanceById ,getEligibleMembers} = require("../controllers/instanceController");
const uploadReportFile = require("../middleware//uploadReportFile");
router.post(
  "/",
  authenticateToken,
  checkRole("ADMIN"),
  uploadReportFile.single("reportFile"),
  createInstance
);
router.get("/members", authenticateToken, checkRole("ADMIN"), getEligibleMembers);
router.get("/", authenticateToken, checkRole("ADMIN"), getInstances);
router.get("/:id", authenticateToken, checkRole("ADMIN"), getInstanceById);

module.exports = router;    