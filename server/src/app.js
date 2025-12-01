const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require ("./routes/user.routes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/memberships", require("./routes/membership.routes"));
app.use('/api', require('./routes/membership.routes'));
app.get("/api/health", (req, res) =>
{
    res.json({ status: "OK" });
});

module.exports = app;