import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import errorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware.js"
import Chat from "./models/Chat.js"
import authRouter from "./routes/auth.js"
import chatRouter from "./routes/chat.js"
import { authenticateUser } from "./middlewares/AuthMiddleware.js"
import jwt from "jsonwebtoken"

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/chat", authenticateUser, chatRouter)

// middleware to check JWT on socket connection
io.use((socket, next) => {
  const token = socket.handshake.headers.cookie
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1]

  if (!token) return next(new Error("Unauthorized"))

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return next(new Error("Invalid token"))
    socket.user = decoded // attach user info to socket
    next()
  })
})

io.on("connection", (socket) => {
  socket.on("sendMessage", async ({ text }) => {
    if (!text?.trim()) return

    // always get or create the single global chat
    let chat = await Chat.findOne().populate("members", "username")
    if (!chat) {
      chat = await Chat.create({ members: [], messages: [] })
    }

    const message = {
      sender: socket.user.userId,
      text,
      timestamp: new Date(),
    }

    chat.messages.push(message)

    // add sender to members if not already
    if (!chat.members.includes(socket.user.userId)) {
      chat.members.push(socket.user.userId)
    }

    await chat.save()
    await chat.populate("messages.sender", "username")

    const newMessage = chat.messages[chat.messages.length - 1]

    // broadcast to ALL sockets (no rooms)
    io.emit("newMessage", {
      _id: newMessage._id,
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      sender: {
        _id: newMessage.sender._id,
        username: newMessage.sender.username,
      },
    })
  })
})

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" })
})

app.use(errorHandlerMiddleware)

try {
  await mongoose.connect(process.env.MONGO_URL)
  httpServer.listen(PORT, () => {
    console.log("server running...")
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
