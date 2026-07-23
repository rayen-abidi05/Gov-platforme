
const router = require("express").Router();
const { getMinisterFormulaires, reviewMinisterFormulaire } = require("../controllers/ministerFormulaire");
const checkRole = require("../middleware/checkRole"); 

router.get("/", checkRole(["MINISTER"]), getMinisterFormulaires);
router.patch("/:id", checkRole(["MINISTER"]), reviewMinisterFormulaire);

module.exports = router;