const router = require("express").Router();

//GET semua room
router.get("/", (req, res) => 
{
  res.json({ msg: "get all rooms placeholder" });
});

//CREATE room baru
router.post("/", (req, res) =>
{
    res.json({ msg: "create room placeholder" });
});

//GET room by ID
router.get("/:id", (req, res) =>
{
    res.json({ msg: "get room by id placeholder" });
});
module.exports = router;
