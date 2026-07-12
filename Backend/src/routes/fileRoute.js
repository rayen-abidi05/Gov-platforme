const express = require('express');
const upload = require("../middleware/upload");
const {getFiles,
    addFiles,
    viewFile,
    downloadFile} = require ("../controllers/files")
const router = express.Router();


router.get("/",getFiles);

router.get("/:id/view",viewFile);

router.get("/:id/download",downloadFile);


module.exports = router;