const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authtoken");
const checkRole = require("../middleware/checkRole");
const {
  assignToInspa,
  getAssignedInspections,
  getAllInspections,
  getInspectionHistory,
  completeInspection,
  getAllInspectionsAdmin
} = require("../controllers/storageInspectionController");

router.get("/", authenticateToken, checkRole("INSPA"), getAssignedInspections);
router.get("/assigned", authenticateToken, checkRole("INSPA"), getAssignedInspections);
router.get("/completed", authenticateToken, checkRole("INSPA"), getAllInspections);
router.get("/history", authenticateToken, checkRole("INSPA"), getInspectionHistory);
router.patch("/:id/complete", authenticateToken, checkRole("INSPA"), completeInspection);
router.get("/admin/all", authenticateToken, checkRole("ADMIN"), getAllInspectionsAdmin);
module.exports = router;