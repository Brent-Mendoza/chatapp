import axios from "axios"

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_PORT}/api/v1`,
  withCredentials: true,
})

export const getChats = () => axiosClient.get("/chat/my-chats")

// create new chat
export const createChat = (memberIds: string[], isGroup = false) =>
  axiosClient.post("/chat/create", { memberIds, isGroup })

// get messages in a chat
export const getMessages = (chatId: string) =>
  axiosClient.get(`/chat/${chatId}/messages`)

export default axiosClient
