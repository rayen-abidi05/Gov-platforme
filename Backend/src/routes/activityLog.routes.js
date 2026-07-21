
const router = require("express").Router();
const { getActivityLogs } = require("../controllers/activityLog.controller");
const  checkRole = require("../middleware/checkRole"); 

router.get("/", checkRole(["OBSERVATOR"]), getActivityLogs);

module.exports = router;