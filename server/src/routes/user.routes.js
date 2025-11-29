const router = require("express").Router();

//GET semua user
router.get("/", (req, res) => 
{
  res.json({ msg: "get all users placeholder" });
});

//GET user by ID
router.get("/:id", (req, res) => 
{
  res.json({ msg: "get user by id placeholder" });
});

//UPDATE bio user
router.patch("/:id/profile", (req, res) =>
{
    res.json({ msg: "update user bio placeholder" });
});

//UPDATE profile picture user
router.patch("/:id/profile", (req, res) =>
{
    res.json({ msg: "update user avatar placeholder" });
});

module.exports = router;
