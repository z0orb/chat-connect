const router = require("express").Router();
const controller = require("../controllers/membership.controller");
const { verifyToken } = require('../middleware/auth');

//GET semua member room
router.get("/:rid/members", controller.getAllMembers);

//GET member room by user id
router.get("/:rid/members/:uid", controller.getMemberById);

//CREATE user baru atau add status room membership ke user
router.post("/", verifyToken, controller.addMember);

//UPDATE member role in room
router.patch("/:rid/members/:uid", verifyToken, controller.updateMemberRole);

//DELETE membership user atau kick user dari room
router.delete("/:rid/members/:uid", verifyToken, controller.kickMemberById);

module.exports = router;