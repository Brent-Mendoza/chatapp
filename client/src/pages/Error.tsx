import { useNavigate } from "react-router-dom"

export default function Error() {
  const navigate = useNavigate()
  return (
    <main className="min-h-screen max-w-screen flex flex-col items-center justify-center ">
      <section className="flex-1 flex flex-col gap-2 items-center justify-center ">
        <h1 className="text-4xl font-bold">
          Something went wrong. Please try again
        </h1>
        <button
          className="bg-green-300 p-4 text-2xl rounded-xl cursor-pointer hover:scale-105 hover:bg-green-400 duration-200"
          onClick={() => {
            navigate("/")
          }}
        >
          Refresh
        </button>
      </section>
    </main>
  )
}
