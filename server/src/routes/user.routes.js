const router = require("express").Router();
const controller = require("../controllers/user.controller");

//GET semua user 
router.get("/api/users", controller.getAllUser);

//GET user by ID 
router.get("/api/users/:uid", controller.getUserById);

//UPDATE username
router.patch("/api/users/:uid/profile/username", controller.updateUsername);

//UPDATE user profile ke db
router.patch("/api/users/:uid", controller.updateProfile);

//UPDATE bio
router.patch("/api/users/:uid/profile/bio", controller.updateBio);

//DELETE akun user
router.delete("/api/users/:uid", controller.deleteUserAccount);
module.exports = router;
