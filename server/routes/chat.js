import { Router } from "express"
import { getMessages, sendMessage } from "../controllers/ChatController.js"

const router = Router()

router.get("/", getMessages)
router.post("/message", sendMessage)

export default router
