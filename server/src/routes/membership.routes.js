const router = require("express").Router();
const controller = require("../controllers/membership.controller");

//GET semua member room
router.get("/api/rooms/:rid/members", controller.getAllMembers);

//GET member room by user id
router.get("/api/rooms/:rid/members/:uid", controller.getMemberById);

//CREATE user baru atau add status room membership ke user
router.post("/api/members", controller.addMember);

//UPDATE member role in room
router.patch("/api/rooms/:rid/members/:uid", controller.updateMemberRole);

//DELETE membership user atau kick user dari room
router.delete("/api/rooms/:rid/members/:uid", controller.kickMemberById);

module.exports = router;