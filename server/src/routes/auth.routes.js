const router = require("express").Router();
const controller = require("../controllers/auth.controller");

//CREATE akun baru/register
router.post("/register", controller.register)

//CREATE login existing akun
router.post("/login", controller.login);

module.exports = router;
