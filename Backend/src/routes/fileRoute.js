const express = require('express');
const upload = require("../middleware/upload");
const {getFiles} = require ("../controllers/files")
const router = express.Router();


router.get("/",getFiles);




module.exports = router;