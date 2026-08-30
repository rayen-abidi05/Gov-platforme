const express = require('express');
const authenticateToken = require('../middleware/authToken');
const {getCompany} = require ("../controllers/company")
const router = express.Router();


router.get("/me",authenticateToken,getCompany);




module.exports = router;