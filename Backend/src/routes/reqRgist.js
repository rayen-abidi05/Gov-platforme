const express = require('express');

const router = express.Router();

const { getRequestRegis , getAllRequestRegis , getRequestRegisById , addRequest } = require('../controllers/manageRegistrationRequest');
const authenticateToken = require('../middleware/authToken');
const adminCheck = require ("../middleware/adminCheck")


router.get("/",authenticateToken,adminCheck,getAllRequestRegis);
router.get("/myRequests",authenticateToken,getRequestRegis);
router.get("/:id",authenticateToken,getRequestRegisById);
router.post(
    "/",
    authenticateToken,
    upload.fields([
        { name: "RNE", maxCount: 1 },
        { name: "TAXREALTED", maxCount: 1 },
        { name: "DIWAN", maxCount: 1 },
        { name: "QUITTANCE", maxCount: 1 },
        { name: "EXISTANCEDECLARATION", maxCount: 1 },
        { name: "RENTEDDECLARATION", maxCount: 1 },
        { name: "CERTIFICATIONOWNERSHIP", maxCount: 1 },
    ]),
    addRequest
);




module.exports = router;