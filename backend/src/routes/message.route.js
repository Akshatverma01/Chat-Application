import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createMessage, getMessages, getUserForSidebar } from "../controllers/message.controller.js";

const router = express.Router();


router.get("/users",protectRoute,getUserForSidebar );
router.get("/:id",protectRoute, getMessages);
router.post("/send/:id", protectRoute, createMessage);


export default router;