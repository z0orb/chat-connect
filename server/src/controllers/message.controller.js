//GET semua message
exports.getAll = (req, res) =>
{
    res.json({ msg: "get all messages placeholder"});
}

//CREATE new message
exports.sendMessage = (req, res) =>
{
    res.json({ msg: "create/send message placeholder"})
}

//DELETE message from chat by message id
exports.deleteMessage = (req, res) =>
{
    res.json({ msg: "delete message from chat placeholder"});
}

//UPDATE message (editing message by message id)
exports.editMessage = (req, res) =>
{
    res.json({ msg: "edit message placeholder"});
}