const express = require('express');
const upload = require("../middleware/upload");
const {getFiles} = require ("../controllers/files")
const router = express.Router();


router.get("/upload",upload.single("file"),getFiles);




module.exports = router;