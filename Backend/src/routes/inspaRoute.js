const express = require('express');
const authenticateToken = require('../middleware/authToken');
const router = express.Router();


router.get("/",authenticateToken);




module.exports = router;