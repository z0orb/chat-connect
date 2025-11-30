const router = require("express").Router();
const controller = require("../controllers/message.controller");

//GET semua message
router.get("/api/messages", controller.getAll);

//CREATE message baru
router.post("/api/messages", controller.sendMessage);

//DELETE message by msg id
router.delete("/api/messages/:msgid", controller.deleteMessage);

//UPDATE message by msg id (edit message)
router.patch("/api/messages/:msgid", controller.editMessage);

module.exports = router;
