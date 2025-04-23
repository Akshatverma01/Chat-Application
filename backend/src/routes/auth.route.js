import { Router } from "express";
import { login, logout, signUp ,updateProfile,checkUserAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middlewar.js"

const router = Router();

router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",protectRoute,upload.single("profilePic"), updateProfile)
router.get("/check", protectRoute, checkUserAuth)

export default router;