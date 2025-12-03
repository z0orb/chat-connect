const router = require("express").Router();
const controller = require("../controllers/message.controller");
const { verifyToken } = require('../middleware/auth');

//GET semua message
router.get("/", verifyToken, controller.getAll);

//CREATE message baru
router.post("/", verifyToken, controller.sendMessage);

//DELETE message by msg id
router.delete("/:msgid", verifyToken, controller.deleteMessage);

//UPDATE message by msg id (edit message)
router.patch("/:msgid", verifyToken, controller.editMessage);

module.exports = router;
