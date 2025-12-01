const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/auth');

//GET semua user 
router.get("/", controller.getAllUser);

//GET user by ID 
router.get("/:uid", controller.getUserById);

//UPDATE username
router.patch("/:uid/username", verifyToken, controller.updateUsername);

//UPDATE user profile ke db
router.patch("/:uid", verifyToken, controller.updateProfile);

//UPDATE bio
router.patch("/:uid/bio", verifyToken, controller.updateBio);

//DELETE akun user
router.delete("/:uid", verifyToken, controller.deleteUserAccount);

module.exports = router;
