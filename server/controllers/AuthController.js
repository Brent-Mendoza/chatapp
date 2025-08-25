import jwt from "jsonwebtoken"
import User from "../models/User.js"
export const login = async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ message: "Username is required" })
  }

  const user = await User.create({ username })

  const token = jwt.sign(
    { userId: user._id, username: username },
    process.env.SECRET_KEY,
    {
      expiresIn: "1y",
    }
  )

  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })

  res.status(200).json({ message: "Login successful" })
}

export const getUser = (req, res) => {
  res.status(200).json({ user: req.user, message: "User fetched successfully" })
}

// GET /api/v1/users/search?username=abc
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query
    if (!username) return res.json([])

    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: req.user.userId }, // exclude self
    }).select("username _id")

    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
