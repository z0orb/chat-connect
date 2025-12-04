const router = require("express").Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require('../middleware/auth');

//GET semua user 
router.get("/", controller.getAllUser);

//GET current user (me)
router.get("/me", verifyToken, controller.getCurrentUser);

//UPDATE current user profile (me)
router.patch("/me", verifyToken, controller.updateCurrentUserProfile);

//UPDATE current user username (me)
router.patch("/me/username", verifyToken, controller.updateCurrentUsername);

//DELETE akun current user (me)
router.delete("/me", verifyToken, controller.deleteCurrentUserAccount);

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
