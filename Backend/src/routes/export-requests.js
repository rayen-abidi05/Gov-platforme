const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authtoken");
const requireRole = require("../middleware/requireRole");
const {  decideExportRequest } = require("../controllers/exportRequestController");

router.patch("/:id/decide", authenticateToken, requireRole("ADMIN"), decideExportRequest);

module.exports = router;