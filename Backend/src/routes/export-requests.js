const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authtoken");
const checkRole = require("../middleware/checkRole");
const {  getMyExportRequest,sendToCommittee,getAgrimMonitoring,getMyExportRequests,decideExportRequest ,resolveAgrim,createExportRequest,getExportRequests,getExportRequest} = require("../controllers/exportRequestController");
const upload = require("../middleware/upload")
router.get(
  "/my-requests",
  authenticateToken,
  checkRole("EXPORTER"),
  getMyExportRequests
);
router.get(
  "/my-requests/:id",
  authenticateToken,
  checkRole("EXPORTER"),
  getMyExportRequest
);
router.patch("/:id/decide", authenticateToken, checkRole("ADMIN"), decideExportRequest);
router.patch("/:id/resolve-agrim", authenticateToken, checkRole("ADMIN"), resolveAgrim);
router.post(
  "/",
  authenticateToken,
  checkRole("EXPORTER"),
  upload.fields([
    { name: "AGRIM", maxCount: 1 },
    { name: "CONTRACT", maxCount: 1 },
    { name: "MINISTERIAL_LETTER", maxCount: 1 },
  ]),
  createExportRequest
);
router.get(
  "/",
  authenticateToken,
  checkRole(["ADMIN", "OBSERVATOR"]),
  getExportRequests
);

router.get(
  "/:id",
  authenticateToken,
  checkRole(["ADMIN", "OBSERVATOR"]),
  getExportRequest
);

router.get(
  "/agrim-monitoring",
  authenticateToken,
  checkRole("ADMIN"),
  getAgrimMonitoring
);
router.patch(
 "/:id/send-to-committee",
 authenticateToken,
 checkRole("ADMIN"),
 sendToCommittee
);
module.exports = router;