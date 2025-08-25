import { useEffect, useState } from "react"
import axiosClient from "../../../axiosClient"

export default function LeftPanel() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }
    const timeout = setTimeout(async () => {
      const res = await axiosClient.get(`/auth/search?username=${search}`)
      setResults(res.data)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  const createOneChat = async (id: string) => {
    await axiosClient.post("/chat/one-on-one", { userId: id })
    setSearch("")
    setResults([])
  }

  return (
    <div className="border-r w-[15vw] max-[1380px]:hidden bg-green-200 rounded-l-xl flex flex-col px-2">
      <h2 className="mx-auto mt-4 text-4xl font-semibold max-lg:text-3xl">
        Rooms
      </h2>
      <div className="relative">
        <form className="mt-2 w-full flex items-center justify-center">
          <input
            type="text"
            className="px-2 py-1 border bg-white focus:outline-0 w-full"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {/* Dropdown */}

        {results.length > 0 && (
          <ul className="absolute top-[38px] left-1/2 w-full border-t-0 -translate-x-1/2 bg-white border mt-1 z-10 max-h-60 overflow-auto shadow-lg">
            {results.map((user) => (
              <li
                className="px-2 py-1 hover:bg-green-300 cursor-pointer"
                key={user._id}
                onClick={() => createOneChat(user._id)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 overflow-y-auto scroll-smooth scrollbar-hide">
        <div className="border p-2 rounded-xl bg-green-50">
          <h4 className="text-xl font-semibold"></h4>
          <p></p>
        </div>
      </div>
    </div>
  )
}
