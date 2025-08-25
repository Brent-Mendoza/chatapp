import { Outlet } from "react-router-dom"
import NavBar from "./components/Navbar"
import { useQuery } from "@tanstack/react-query"
import axiosClient from "../axiosClient"
import React from "react"

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosClient.get("/auth/user")
      return res.data
    },
    retry: false,
  })
}

type AuthContextType = ReturnType<typeof useUser>
const AuthContext = React.createContext<AuthContextType | null>(null)

export default function Layout() {
  const userQuery = useUser()
  return (
    <div className="min-h-screen max-w-screen flex flex-col bg-green-100/40">
      <NavBar />
      <AuthContext.Provider value={userQuery}>
        <Outlet />
      </AuthContext.Provider>
    </div>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within a AuthProvider")
  return context as ReturnType<typeof useUser>
}
