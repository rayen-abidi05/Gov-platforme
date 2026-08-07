const express = require("express");
const router = require("express").Router();
const { getMinisterFormulaires, reviewMinisterFormulaire } = require("../controllers/ministerFormulaire");
const checkRole = require("../middleware/checkRole"); 

router.get("/", checkRole(["MINISTER"]), getMinisterFormulaires);
router.patch("/:id/review", checkRole(["MINISTER"]), reviewMinisterFormulaire);

module.exports = router;