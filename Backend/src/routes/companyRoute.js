const express = require('express');
const upload = require("../middleware/upload");
const {getCompany} = require ("../controllers/company")
const router = express.Router();


router.get("/me",getCompany);




module.exports = router;