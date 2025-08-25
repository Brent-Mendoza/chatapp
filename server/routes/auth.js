import { Router } from "express"
import { loginSchema, validate } from "../middlewares/ValidationMiddleware.js"
import { getUser, login, searchUsers } from "../controllers/AuthController.js"
import { authenticateUser } from "../middlewares/AuthMiddleware.js"

const router = Router()

router.post("/login", validate(loginSchema), login)
router.get("/user", authenticateUser, getUser)
router.get("/search", authenticateUser, searchUsers)

export default router
