
const router = require("express").Router();
const { getMinisterFormulaires, reviewMinisterFormulaire } = require("../controllers/ministerFormulaire");
const { requireAuth, requireRole } = require("../middlewares/auth"); // matching your existing middleware names

router.get("/api/minister-formulaires", requireAuth, requireRole(["MINISTER"]), getMinisterFormulaires);
router.patch("/api/minister-formulaires/:id", requireAuth, requireRole(["MINISTER"]), reviewMinisterFormulaire);

module.exports = router;