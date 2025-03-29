import express from "express"
import { googleAuth, googleAuthCallback, getAuthStatus } from "../controllers/authController.js"

const router = express.Router()

router.get("/google", googleAuth)
router.get("/google/callback", googleAuthCallback)
router.get("/status", getAuthStatus)

export default router

