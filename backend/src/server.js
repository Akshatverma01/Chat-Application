// import app from "./app.js";
import { server } from "./utils/socket.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
