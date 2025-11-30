const router = require("express").Router();
const controller = require("../controllers/room.controller");

//GET semua room
router.get("/api/rooms", controller.getAllRooms);

//GET room by ID
router.get("/api/rooms/:rid", controller.getRoomById);

//CREATE room baru
router.post("/api/rooms", controller.createRoom);

//UPDATE room ke db
router.patch("/api/rooms/:rid", controller.updateRoom);

//DELETE room by room id
router.delete("/api/rooms/:rid", controller.deleteRoomById);

module.exports = router;
