//GET semua anggota room
exports.getAllMembers = (req, res) => 
{
    res.json({ msg: "get all memberships placeholder" });
};

//GET user dalam room by id
exports.getMemberById = (req, res) => 
{
    res.json({ msg: "get membership by id placeholder" });
};

//CREATE add user ke dalam room / create membership status
exports.addMember = (req, res) => 
{
    res.json({ msg: "create user membership placeholder" });
};

//UPDATE member role room member
exports.updateMemberRole = (req, res) =>
{
    res.json({ msg: "update member role in room placeholder "});
}
  
//DELETE status membership user / kick user dari room
exports.kickMemberById = (req, res) => 
{
    res.json({ msg: "delete membership placeholder" });
};