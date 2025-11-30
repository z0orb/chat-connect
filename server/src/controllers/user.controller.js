//GET semua user 
exports.getAllUser = (req, res) =>
{
    res.json({ msg: "get all user placeholder"});
}


//GET user by ID 
exports.getUserById = (req, res) =>
{
    res.json({ msg: "get users by id"});
}

//UPDATE username
exports.updateUsername = (req, res) =>
{
    res.json({ msg: "update username placeholder"});
}

//UPDATE bio
exports.updateBio = (req, res) =>
{
    res.json({ msg: "update user bio placeholder"});
}

//UPDATE user profile
exports.updateProfile = (req, res) =>
{
    res.json({ msg: "placeholder update profile ke db"});
}

//DELETE akun user
exports.deleteUserAccount = (req, res) =>
{
    res.json({ msg: "delete user account placeholder"});
}