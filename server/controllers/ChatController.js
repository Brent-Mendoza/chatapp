// controllers/chatController.js
import Chat from "../models/Chat.js"

export const getMessages = async (req, res) => {
  try {
    let chat = await Chat.findOne().populate("messages.sender", "username")

    if (!chat) {
      chat = await Chat.create({ members: [], messages: [] })
    }

    // normalize messages
    const normalizedMessages = chat.messages.map((m) => ({
      _id: m._id,
      text: m.text,
      timestamp: m.timestamp,
      sender: {
        _id: m.sender._id,
        username: m.sender.username,
      },
    }))

    res.json({ messages: normalizedMessages, members: chat.members })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ message: "Message text required" })

    let chat = await Chat.findOne()
    if (!chat) {
      chat = await Chat.create({ members: [], messages: [] })
    }

    const message = {
      sender: req.user.userId,
      text,
      timestamp: new Date(),
    }

    chat.messages.push(message)
    if (!chat.members.includes(req.user.userId)) {
      chat.members.push(req.user.userId)
    }

    await chat.save()
    await chat.populate("messages.sender", "username")

    // get last added message
    const newMessage = chat.messages[chat.messages.length - 1]

    res.status(201).json({
      message: {
        _id: newMessage._id,
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        sender: {
          _id: newMessage.sender._id,
          username: newMessage.sender.username,
        },
      },
      members: chat.members,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
