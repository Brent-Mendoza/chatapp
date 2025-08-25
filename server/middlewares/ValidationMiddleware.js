import z from "zod"
import User from "../models/User.js"

export const validate = (schema) => async (req, res, next) => {
  const result = await schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() })
  }

  const userExists = await User.findOne({ username: result.data.username })

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" })
  }

  req.body = result.data

  next()
}

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .trim(),
})
