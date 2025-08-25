import jwt from "jsonwebtoken"
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" })

    req.user = decoded

    next()
  })
}
