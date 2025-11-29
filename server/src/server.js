require('dotenv').config();
const http = require("http");
const app = require("./app");
const initDB = require("./config/db");

initDB();

const server = http.createServer(app);

require("./sockets/chat.socket")(server);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));