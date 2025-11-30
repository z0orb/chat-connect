const router = require("express").Router();
const controller = require("../controllers/auth.controller");

//CREATE akun baru/register
router.post("/api/auth/register", controller.register)

//CREATE login existing akun
router.post("/api/auth/login", controller.login);

module.exports = router;
