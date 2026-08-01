const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authtoken");
const checkRole = require("../middleware/checkRole");
const { createInstance, getInstances, getInstanceById } = require("../controllers/instanceController");

router.post("/", authenticateToken, checkRole("ADMIN"), createInstance);
router.get("/", authenticateToken, checkRole("ADMIN"), getInstances);
router.get("/:id", authenticateToken, checkRole("ADMIN"), getInstanceById);

module.exports = router;    