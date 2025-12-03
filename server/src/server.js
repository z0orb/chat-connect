require('dotenv').config();

const http = require("http");
const app = require("./app");
const initDB = require("./config/db");

initDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5001 || 5002;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));