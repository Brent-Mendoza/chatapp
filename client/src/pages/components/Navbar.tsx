import { useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()

  const isLandingPage = location.pathname === "/"
  return (
    <header className={`${!isLandingPage && "max-[1380px]:hidden"} `}>
      <nav className="p-4">
        <h2 className="text-4xl font-comic font-bold tracking-tighter">
          Chat App
        </h2>
      </nav>
    </header>
  )
}
