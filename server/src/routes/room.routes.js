const router = require("express").Router();
const controller = require("../controllers/room.controller");
const { verifyToken } = require('../middleware/auth');

//GET semua room
router.get("/", controller.getAllRooms);

//GET room by ID
router.get("/:rid", controller.getRoomById);

//CREATE room baru
router.post("/", verifyToken, controller.createRoom);

//UPDATE room ke db
router.patch("/:rid", verifyToken, controller.updateRoom);

//DELETE room by room id
router.delete("/:rid", verifyToken, controller.deleteRoomById);

module.exports = router;
