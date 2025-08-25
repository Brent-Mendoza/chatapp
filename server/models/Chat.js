import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
  messages: [
    {
      sender: { type: mongoose.Types.ObjectId, ref: "User" },
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
})

export default mongoose.model("Chat", ChatSchema)
