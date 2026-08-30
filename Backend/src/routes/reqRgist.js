const express = require('express');

const router = express.Router();

const {getApprovedExporters, getRequestRegis , updateRequestStatus , getAllRequestRegis, getRequestRegisByIdAdmin , getRequestRegisById , addRequest } = require('../controllers/manageRegistrationRequest');
const authenticateToken = require('../middleware/authtoken');
const adminCheck = require ("../middleware/adminCheck")
const { assignToInspa,getAssignedInspections } = require("../controllers/storageInspectionController");
const checkRole = require ("../middleware/checkRole")
const upload = require ("../middleware/upload")
router.get("/exporters",authenticateToken,checkRole(["ADMIN","DIWAN_MEMBER"]),getApprovedExporters);
router.get("/",authenticateToken,adminCheck,getAllRequestRegis);
router.get("/myRequests",authenticateToken,getRequestRegis);
router.get("/:id",authenticateToken,getRequestRegisById);
router.get("/admin/:id",authenticateToken,adminCheck,getRequestRegisByIdAdmin);
router.post(
    "/",
    authenticateToken,
    upload.fields([
    { name: "RNE", maxCount: 1 },
    { name: "TAXREALTED", maxCount: 1 },
    { name: "DIWAN", maxCount: 1 },
    { name: "QUITTANCE", maxCount: 1 },
    { name: "EXISTANCEDECLARATION", maxCount: 1 },
    { name: "LABDOC", maxCount: 1 },
    { name: "RENTEDDECLARATION", maxCount: 1 },
    { name: "CERTIFICATIONOWNERSHIP", maxCount: 1 },
    { name: "MARKETCONTROLDECLARATION", maxCount: 1 }, 
]),
    addRequest
);
router.post("/updateStatus/:id",authenticateToken,adminCheck,updateRequestStatus)

router.post("/:id/assign-inspa", authenticateToken, checkRole("ADMIN"), assignToInspa);
router.get("/inspections/assigned", authenticateToken, checkRole("INSPA"), getAssignedInspections);

module.exports = router;