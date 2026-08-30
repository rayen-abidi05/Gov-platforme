const express = require('express');
const authenticateToken = require('../middleware/authtoken');
const {getCompany} = require ("../controllers/company")
const router = express.Router();


router.get("/me",authenticateToken,getCompany);




module.exports = router;