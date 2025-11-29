const router = require("express").Router();

//CREATE akun baru/register
router.post("/register", (req, res) =>
{
    res.json({ msg: "register placeholder" });
});

//CREATE login existing akun
router.post("/login", (req, res) =>
{
    res.json({ msg: "login placeholder" });
});

module.exports = router;
