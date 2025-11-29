const router = require("express").Router();

//GET semua message
router.get("/", (req, res) => 
{
  res.json({ msg: "get all messages placeholder" });
});

//CREATE message baru
router.post("/", (req, res) =>
{
    res.json({ msg: "send message placeholder" });
});

module.exports = router;
