const express = require('express');

const router = express.Router();

const { getRequestRegis , getAllRequestRegis , getRequestRegisById , addRequest } = require('../controllers/manageRegistrationRequest');
const authenticateToken = require('../middleware/authToken');
const adminCheck = require ("../middleware/adminCheck")


router.get("/",authenticateToken,adminCheck,getAllRequestRegis);
router.get("/myRequests",authenticateToken,getRequestRegis);
router.get("/:id",authenticateToken,getRequestRegisById);
router.post("/",authenticateToken,addRequest);




module.exports = router;