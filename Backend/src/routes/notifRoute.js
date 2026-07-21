const express = require('express');
const upload = require("../middleware/upload");
const {getNotifications,getNotificationsAll,read
    } = require ("../controllers/notification")
const router = express.Router();

router.get("/",getNotifications);

router.get("/all",getNotificationsAll)
router.put("/:id/read",read)
module.exports = router;