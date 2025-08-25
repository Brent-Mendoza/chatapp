import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import axiosClient from "../../axiosClient"
import { useAuth } from "../Layout"
import { useForm, type FieldValues } from "react-hook-form"

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const { data: user } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm()
  const [socket, setSocket] = useState<Socket | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await axiosClient.get("/chat")
      return res.data
    },
  })

  useEffect(() => {
    if (!user) return

    const newSocket = io(import.meta.env.VITE_BACKEND_PORT, {
      withCredentials: true,
    })

    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Connected with socket id:", newSocket.id)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [user]) // reconnect only when user changes

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages)
    }
  }, [data])

  useEffect(() => {
    if (!socket) return
    socket?.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message])
    })
    return () => {
      socket?.off("newMessage")
    }
  }, [socket])

  useEffect(() => {
    const container = document.getElementById("messages-container")
    if (!container || messages.length === 0) return

    const lastMsg = messages[messages.length - 1]

    if (lastMsg.sender?._id?.toString() === user?.user?.userId?.toString()) {
      // If YOU sent the message → always scroll
      container.scrollTop = container.scrollHeight
    } else {
      // If someone else sent the message → only scroll if you're near the bottom
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [messages, user])

  const onSubmit = async (data: FieldValues) => {
    if (!data.message.trim()) return
    socket?.emit("sendMessage", { text: data.message })
    reset()
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <section className="max-[1380px]:flex-1 max-[1380px]:w-full max-[1380px]:rounded-none max-[1500px]:w-[90vw] h-[70vh] w-[70vw] border rounded-xl flex">
        <div className="flex-1 flex flex-col relative min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b flex items-center gap-5 bg-green-300 rounded-t-xl max-[1380px]:rounded-none">
              <h2 className="text-4xl font-semibold">Chat</h2>
            </div>
            {isLoading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            )}
            {!isLoading && (
              <div
                className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto scrollbar-hide min-h-0"
                id="messages-container"
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      m.sender?._id?.toString() ===
                      user?.user?.userId?.toString()
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <p className="px-2 text-sm text-gray-600">
                      {m.sender?.username || "Unknown"}
                    </p>
                    <div
                      className={`max-w-[20vw] max-lg:max-w-[50vw] break-words  border rounded-xl px-3 py-2 ${
                        m.sender?._id?.toString() ===
                        user?.user?.userId?.toString()
                          ? "bg-white"
                          : "bg-green-200"
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-[15vh] flex border-t relative">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
              <textarea
                className="w-full h-full resize-none p-4 focus:outline-0 bg-white rounded-b-xl"
                placeholder="Type your message..."
                {...register("message")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault() // stop newline
                    handleSubmit(onSubmit)() // manually trigger form submit
                  }
                }}
              ></textarea>
              {isSubmitting && (
                <div className="absolute right-4 bottom-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
